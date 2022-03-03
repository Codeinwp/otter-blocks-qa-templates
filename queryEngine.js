(() => {

	const REGISTERED_SOURCES = {
		"robert": "https://raw.githubusercontent.com/Soare-Robert-Daniel/otter-blocks-qa-templates/main/"
	}

	class QueryEngineQA {
		constructor( sources ) {
			this.sources = sources;
			this.owner = '';
			this.folder = 'blocks';
			this.query = undefined;
		}

		addSource( source ) {
			this.sources = { ...this.sources, source }
			return this;
		}

		setOwner( owner ) {
			this.owner = owner;
			return this;
		}

		useBlocks() {
			this.folder = 'blocks';
			return this;
		}

		useTemplate() {
			this.folder = 'templates';
			return this;
		}

		useQuery(query) {
			this.query = query;
			return this;
		}

		async run() {

			if( this.query === undefined ) {
				console.warn("The query is empty!");
				return;
			}

	      	console.log("Run query!");
			const mainPath = this.sources[this.owner] + this.folder;

			const respIndex = await fetch(`${mainPath}/index.json`, {
						method: 'GET',
						headers: {
							'Accept': 'application/json'
						}
					})

			if( ! respIndex.ok ) {
				console.warn('The source does not exists')
				return;
			}
			const index = await respIndex.json();

			console.log(index)

			const templateBlocks = index?.blocks
				?.filter( blockSlug => {
					if( this.query?.exclude && this.query?.exclude.includes( blockSlug ) ) {
						return false;
					}

					if( this.query?.include && this.query?.include.includes( blockSlug ) ) {
						return true;
					}

					// If include doesn't have a value, then all the blocks that are not excluded are valid 
					return this.query.include === undefined;
				})

			const blocksContent = wp.data?.select( 'core/blocks' )?.getBlockTypes()
				.filter( ({ name }) => name.includes( 'themeisle-blocks/' ))
				.map( ({name}) => name?.replace('themeisle-blocks/', '') )
				.filter( blockSlug => templateBlocks?.includes(blockSlug) )
				.map( blockSlug => {
					const path = `${mainPath}/${blockSlug}.json`;
					return new Promise( (resolve, reject) => {
						fetch(path, {
							method: 'GET',
							headers: {
								'Accept': 'application/json'
							}
						})
						.then((res)=>{ 
								if(res.ok) return res.json(); 
								else throw new Error("Status code error :" + res.status) 
						})
						.then(data=>resolve(data))
						.catch(error=>reject(error))
					})
				})
				
				
			Promise.all(blocksContent)
				.then( ( templates ) => {
					console.log(`Loaded: ${templates?.length} blocks!`)
					templates.forEach( template => {
						if( template.content ) {
							const block = wp?.blocks?.parse(template?.content)
							if( block ) {
								wp?.data?.dispatch('core/block-editor')?.insertBlocks(block)
							}
						}
					})
				})
				.catch( err => console.warn(err) )
			}
	}
	console.log("Query Engine Script Loaded")
	const global = window || globalThis;
	global.QueryEngineQA = QueryEngineQA;
	global.qaOtter = (new QueryEngineQA(REGISTERED_SOURCES)).setOwner("robert")
})()

