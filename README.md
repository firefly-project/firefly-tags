# \<firefly-tags\>

This component displays a list of tags. An autocomplete component gives the user
  a list of suggested tags. A firebase query makes use of the 'suggested-values-path', to get a list
  of suggestions.  When the user makes a selection, the selection is stored in two places:
   - in a model node (i.e. 'model.tags')
   - as subnodes of the 'selected-values-path' (i.e. /tags-companies/{tagId}/{companyObject}), 
    this makes it possible to easily query all companies that have a specific tag

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
