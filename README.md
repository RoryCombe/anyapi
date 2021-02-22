<div align="center">
  <h1>any API 🤖</h1>
  <p>A simple, zero config RESTful api that takes whatever you want to throw at it</p>
</div>

---

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/rorycombe/anyapi/validate?logo=github&style=flat-square)
[![codecov](https://codecov.io/gh/RoryCombe/anyapi/branch/master/graph/badge.svg?token=S462N7D27B)](https://codecov.io/gh/RoryCombe/anyapi)

> Note that currently anyapi works only with MongoDB and as such looks for a running mongo connection on the standard `localhost:27017`. There it will create a database called `anyapi` and persist any changes to it.

## Getting Started

```
npm install
```

and

```
npm start
```

This will start the server on the default port of `2000`. Using any HTTP client you can now `GET`, `POST`, `PUT`, `DELETE` with a collection type that is completely variable and up to you.

For example `hamburgers`:

```
fetch('http://localhost:2000/hamburgers', {
  method: 'POST',
  body: JSON.stringify({ name: 'Cheese Burger', ingredients: ['beef', 'tomato', 'lettuce', 'cheese'] }),
  headers: new Headers({'Content-Type': 'application/json'})
})
```

Then GET on `http://localhost:2000/hamburgers` to see your new collection

## Methods

- `GETALL` on `:collection`
- `GET` on `:collection` with `:id`
- `CREATE` on `:collection` with `:data`
- `UPDATE` on `:collection` with `:id` and `:data`
- `DESTROY` on `:collection` with `:id`
