<div align="center">
  <h1>any API 🤖</h1>
  <p>A simple, zero config RESTful api that takes whatever you want to throw at it</p>
</div>

---

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/rorycombe/anyapi/validate?logo=github&style=flat-square)

## Getting Started

```
npm install
```

and

```
npm start
```

Then simply post some data to anything, for example `todos`:

```
fetch('http://localhost:2000/todos', {
  method: 'POST',
  body: JSON.stringify({ title: 'Write a README', completed: false }),
  headers: new Headers({'Content-Type': 'application/json'})
})
```

Then GET on `http://localhost:2000/todos` to see your new collection

## Methods

- `GETALL` on `:collection`
- `GET` on `:collection` with `:id`
- `CREATE` on `:collection` with `:data`
- `UPDATE` on `:collection` with `:id` and `:data`
- `DESTROY` on `:collection` with `:id`
