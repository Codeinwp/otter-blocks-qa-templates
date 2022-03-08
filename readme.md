# Otter Tool Testing
> This tool insert blocks exports into the page.

## Getting started

This is chrome browser extension. You can add the folder `chrome-extension` this via [Developer Mode](https://developer.chrome.com/docs/extensions/mv3/faq/#:~:text=You%20can%20start%20by%20turning,a%20packaged%20extension,%20and%20more.)

The interface is WIP. But you can use the Query Engine via Console. Go to Console via `Inspect` and run a query like this:

Insert a Flip block.
```javascript
qaOtter.addQuery({ blocks: { include: ['flip'] } }).build().run()
```

Insert all the blocks, except the Flip block.
```javascript
qaOtter.addQuery({ blocks: { exclude: ['flip'] } }).build().run()
```

Insert all defined blocks from `blocks\index.json`.
```javascript
qaOtter.addQuery({ blocks: {} }).build().run()
``` 

Insert a block with Sticky plugin.
```javascript
qaOtter.addQuery({ plugins: { include: ['sticky'] } }).build().run()
```

Insert all the blocks with the plugins, except the sticky plugin.
```javascript
qaOtter.addQuery({ plugins: { exclude: ['sticky'] } }).build().run()
```

Insert all defined blocks with plugins from `blocks\index.json`.
```javascript
qaOtter.addQuery({ plugins: {} }).build().run()
``` 

Insert all the templates that have the `tabs` block.
```javascript
qaOtter.addQuery({ templates: { with: ['tabs'] } }).build().run()
```
:information_source: The Query Engine can be used without the extension. Just run the code from `queryEngine.js` in the Console. *You also use [Snippets](https://developer.chrome.com/docs/devtools/javascript/snippets/).*
