function Demo({ title }) {
    return <h1>{title}</h1>
  }
  
  function wrapComponent(component) {
    return (
      <div>
        <component title="Bonjour !" />
      </div>
    )
  }
  
  ReactDOM.render(wrapComponent(Demo), document.getElementById('root'))
  