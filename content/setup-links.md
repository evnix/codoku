## Setting up links

Codoku comes with a `config.json` which is used to setup the menu. you can go ahead and edit the file.

A typical link looks as follows:
```json
{
    "name": "Home",
    "href": "index.md",
    "icon": "fa fa-home",
    "newTab": false
}
```
Here icon and newTab property is optional.

#### what about links from one document to another?
you can use markdow for links as follows:

```markdown
[Take me to Test Page](#!test.md)

or

[Take me to Test Page](#!test)
```
**output**: [Take me to Test Page](#!test)

#### what about links to a part of the document?
you can use markdow for links as follows:

```markdown
[Take me to Buy Section](#!index?jump=how-do-i-buy-this)

or

[Take me to Buy Section](#!index.md?jump=how-do-i-buy-this)
```
**output**: [Take me to Buy Section](#!index?jump=how-do-i-buy-this)
