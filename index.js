// Import CSS, Comment before checkin
// import './style.css';

var structure = {
  name: 'CEO',
  children: [
    {
      name: 'Finance Manager',
      children: [],
    },
    {
      name: 'IT Manager',
      children: [],
    },
    {
      name: 'Marketing Manager',
      children: [],
    },
  ],
};

$(document).ready(function () {
  init('org-chart');

  $('body').on('click', '.add', addNode);

  $('body').on('click', '.delete', deleteNode);
});

$(window).on('beforeunload', function () {
  $('body').unbind('click', addNode);
  $('body').unbind('click', deleteNode);
});

function init(id) {
  if (structure) setParentNode(structure, 1, id);
}

function setParentNode(node, level, parentId) {
  let parentElem;
  let hasChild = hasChildren(node);

  parentElem = $(
    `<div class="level-${level} node">
      <h2 contenteditable="true">
        ${node.name}
      </h2>
      ${getActionGroupHtml()}
    </div>`
  );

  $(`#${parentId}`).append(parentElem);

  if (hasChild) $(`#${parentId}`).append(setChildrenWrapper(node, level));
}

function setChildrenWrapper(node, level) {
  level += 1;

  let wrapperId = `wrapper-${level}`;
  let wrapper = $(`<ol id="${wrapperId}" class='level-${level}-wrapper'></ol>`);

  // Adjust grid columns for level based on children length
  // wrapper.css('grid-template-columns', `repeat(${node.children.length}, 1fr)`);

  for (let child of node.children) {
    let liId = `li-${level}`;
    let liElem = $(`<li id="${liId}"></li>`);

    wrapper.append(liElem);
    liElem.append(setChildNode(child, level));

    let hasChild = hasChildren(child);
    if (hasChild) liElem.append(setChildrenWrapper(child, level));
  }

  return wrapper;
}

function setChildNode(node, level) {
  let parentElem = $(
    `<h3 class="level-${level} node" contenteditable="true">
      ${node.name}
      <br />
      ${getActionGroupHtml()}
    </h3>`
  );

  return parentElem;
}

function addNode() {
  var rectElem = $(this).parent().parent();
  var classList = rectElem.attr('class').split(/\s/);
  var levelClass = classList.find((x) => x.indexOf('level-') > -1);
  let currentLevel = parseInt(levelClass.substring('level-'.length));
  let nextLevel = currentLevel + 1;

  var liElem = $(this).parent().parent().parent();

  var newItem = $(`<li>
    <div class="level-${nextLevel} node">
      <h3 class="level-${nextLevel}" contenteditable="true">
        Enter text  
      </h3>
      ${getActionGroupHtml()}
    </div>
  </li>`);

  var wrapper = liElem.children(`ol.level-${nextLevel}-wrapper`);
  if (wrapper && wrapper.length > 0) {
    wrapper.append(newItem);
  } else {
    wrapper = $(`<ol class="level-${nextLevel}-wrapper"></ol>`);

    wrapper.append(newItem);

    liElem.append(wrapper);
  }
}

function deleteNode() {
  var liElem = $(this).parent().parent().parent();

  liElem.remove();
}

function getActionGroupHtml() {
  return `<div contenteditable="false">
    <i class="bi bi-plus-circle add"></i>
    <i class="bi bi-trash delete"></i>
  </div>`;
}

function hasChildren(node) {
  return node.children && node.children.length > 0;
}
