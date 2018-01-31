# ANY API

A simple, zero config RESTful api that takes whatever you want to throw at it

## Methods

* `GETALL` on `:collection`
* `GET` on `:collection` with `:id`
* `CREATE` on `:collection` with `:data`
* `UPDATE` on `:collection` with `:id` and `:data`
* `DESTROY` on `:collection` with `:id`

**Sample POST**

```
fetch('http://localhost:2000/todos', { method: 'POST', body: JSON.stringify({ title: 'Write a README', completed: false }), headers: new Headers({'Content-Type': 'application/json'})})
```
