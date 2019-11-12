<div>
  <div>
    <span>
      <a ref="link">
        <span>Hello</span>
        <input ref="field"></input>
        <p $innerText={ref.field.input$}></p>
      </a>
    </span>
  </div>
  <span $innerText={ref.field.input$}></span>
  <span $innerText={ref.link.click$}></span>
</div>;