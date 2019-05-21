import React from "react";
import { render } from "react-dom";

let Dialog = function(options = {}){
  const div = document.createElement('div');
  document.body.appendChild();
}

let Message = function(options){
  render(<div>{options.message}</div>, document.getElementsByTagName('body')[0])
}


export let list = {
  Dialog,
  Message
};

export default list
