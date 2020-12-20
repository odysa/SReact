function workLoop(deadline){
  while(false){}
  
  // if time run out, then do the job when idle
  requestIdleCallback(workLoop);
}

// current job
function performWork(fiber){
  if(!fiber.dom){
    fiber.dom = createDom(fiber);
  }
  // if has parent
  if(fiber.parent){
    fiber.parent.dom.appendChild(fiber.dom);
  }
  const elements = fiber.children;
  let preSibling = null;
  if(elements && elements.length){
    for(let i = 0;i<elements.length;++i){
      const element = elements[i];
      const newFiber = {
        type:element.type,
        props:element.props,
        parent:fiber,
        dom:null
      }
      if(i===0){
        fiber.child = newFiber
      }else{
        preSibling.sibling = newFiber
      }
      preSibling = newFiber
    }
  }
}

function createDom(fiber){

}

requestIdleCallback(workLoop)