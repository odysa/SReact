function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "object" ? child : createTextElement(child);
      }),
    },
  };
}
function createTextElement(text) {
  return {
    type: "TEXT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(vdom, container) {
  let dom;
  if (vdom.type === "TEXT") {
    dom = document.createTextNode(vdom);
  } else {
    dom = document.createElement(vdom.type);
  }
  // bind attributes
  if (vdom.props) {
    let props = Object.keys(vdom.props).filter((key) => key != children);
    props.forEach((item) => {
      dom[item] = vdom.props[item];
    });
  }
  // render children
  if (vdom.props && vdom.props.children) {
    vdom.props.children.forEach((child) => {
      render(child, dom);
    });
  }
  container.appendChild(dom);
}
