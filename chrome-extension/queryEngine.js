const REGISTERED_SOURCES = {
    "robert": "https://raw.githubusercontent.com/Soare-Robert-Daniel/otter-blocks-qa-templates/main/"
}

class QueryRunner {
    constructor(query) {
        this.query = query;
    }

    lazy() {
        return () => {
            this.run()
        }
    }

    getBlocks(blocks) {
        return blocks.filter(blockSlug => {
            if (this.query?.blocks?.include?.includes(blockSlug)) {
                return true;
            }

            if (this.query?.blocks?.exclude?.includes(blockSlug)) {
                return false;
            }

            // If include doesn't have a value, then all the blocks that are not excluded are valid
            return this.query?.blocks.include === undefined;
        })
    }

    getPlugins(plugins) {
        return plugins.filter(pluginSlug => {
            if (this.query?.plugins?.include?.includes(pluginSlug)) {
                return true;
            }

            if (this.query?.plugins?.exclude?.includes(pluginSlug)) {
                return false;
            }

            // If include doesn't have a value, then all the blocks that are not excluded are valid
            return this.query?.plugins.include === undefined;
        })
    }

    getTemplates(templates) {

        return templates.filter(template => {
            if (this.query?.templates?.use?.includes(template?.name)) {
                return true;
            }

            if (this.query?.templates?.with !== undefined && this.query?.templates?.mode === "all" && this.query?.templates?.with?.every(blockSlug => template?.blocks?.includes(blockSlug))) {
                return true;
            }

            if (this.query?.templates?.with !== undefined && (this.query?.templates?.mode === undefined || this.query?.mode === "some") && this.query?.templates?.with?.every(blockSlug => template?.blocks?.includes(blockSlug))) {
                return true;
            }

            return false;
        }).map( template => template.name )
    }


    async run() {
        if (this.query === undefined) {
            console.warn("The query is empty!");
            return;
        }

        const {metadata, blocks, plugins, templates} = this.query;



        console.log("Run query!");
        const mainPath = metadata.sources[metadata.owner] + metadata.path;

        const respIndex = await fetch(`${mainPath}/index.json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        if (!respIndex.ok) {
            console.warn('The source does not exists')
            return;
        }
        const index = await respIndex.json();

        const files = []

        if( blocks && index?.blocks ) {
            files.push( ...this.getBlocks(index.blocks) )
        }

        if( plugins && index?.plugins ) {
            files.push( ...this.getPlugins(index.plugins) )
        }

        if( templates && index?.templates ) {
            files.push( ...this.getTemplates(index.templates) )
        }

        console.log(index, this.query, files)

        const blocksContent = files
            .map(fileName => {
                const path = `${mainPath}/${fileName}.json`;
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        fetch(path, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            }
                        })
                            .then((res) => {
                                if (res.ok) return res.json();
                                else throw new Error("Status code error :" + res.status)
                            })
                            .then(data => resolve(data))
                            .catch(error => reject(error))
                    }, Math.floor(Math.random() * 10) * 10);

                })
            })


        Promise.all(blocksContent)
            .then((templates) => {
                console.log(`Loaded: ${templates?.length} files!`)
                templates.forEach(template => {
                    if (template.content) {
                        const block = wp?.blocks?.parse(template?.content)
                        if (block) {
                            wp?.data?.dispatch('core/block-editor')?.insertBlocks(block)
                        }
                    }
                })
            })
            .catch(err => console.warn(err))
    }
}

class QueryEngineQA {
    constructor(sources) {
        this.sources = sources;
        this.owner = 'robert';
        this.path = 'blocks'
        this.queries = [];

    }

    addSource(source) {
        this.sources = {...this.sources, source}
        return this;
    }

    setOwner(owner) {
        this.owner = owner;
        return this;
    }

    setPath(path) {
        this.path = path;
        return this;
    }

    addQueries(queries) {
        this.queries.push(...queries)
    }

    addQuery(query) {
        this.queries.push(
            {
                metadata: {
                    sources: this.sources,
                    owner: this.owner,
                    path: this.path
                },
                ...query
            }
        );
        return this;
    }

    reuseQuery() {
        if (this.queries.length > 0) {
            const reusedQ = {...this.queries[this.queries.length - 1]};
            lastQuery.metadata = {
                sources: this.sources,
                owner: this.owner,
                path: this.path
            }
            this.queries.push(reusedQ)
        }

        return this;
    }

    build(array = false) {
        if (this.queries.length === 1 && (!array)) {
            return (new QueryRunner(this.queries.pop()));
        } else if (this.queries.length > 0) {
            const runners = this.queries.map(query => {
                return (new QueryRunner(query));
            })
            return {
                runners,
                run() {
                    runners.forEach(runner => runner?.run())
                }
            }
        }
    }

}

function injectQueryEngine() {
    console.log("Query Engine Script Loaded")
    const global = window || globalThis;
    global.QueryEngineQA = QueryEngineQA;
    global.qaOtter = (new QueryEngineQA(REGISTERED_SOURCES)).setOwner("robert")
}

injectQueryEngine()
