const isNodeLevelExists = (nodeLevelArray, nodeLevel) => {
  if (nodeLevelArray.includes(nodeLevel)) {
    return true;
  }
  return false;
};

export const Expand = params => {
  params.api.forEachNode((node, index) => {
    if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
      node.setExpanded(true);
    }
  });
};

export const Collapse = params => {
  params.api.forEachNode((node, index) => {
    if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
      node.setExpanded(false);
    }
  });
};

export const ExpandAll = params => {
  const nodeLevelArr = [];
  let nodeFound;
  let levelExists;
  params.api.forEachNode((node, index) => {
    if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
      nodeFound = true;
    }
    if (nodeFound) {
      levelExists = isNodeLevelExists(nodeLevelArr, node.level);
      if (!levelExists || levelExists === undefined) {
        node.expanded = true;
        nodeLevelArr.push(node.level);
      }
      if (levelExists && node.level !== 0) {
        node.expanded = true;
      } else {
        if (levelExists && node.level === 0) {
          nodeFound = false;
        }
      }
    }
  });
  params.api.onGroupExpandedOrCollapsed();
};

export const CollapseAll = params => {
  const nodeLevelArr = [];
  let nodeFound;
  let levelExists;
  params.api.forEachNode((node, index) => {
    if (node.group && node.groupData['ag-Grid-AutoColumn'] === params.value) {
      nodeFound = true;
    }
    if (nodeFound) {
      levelExists = isNodeLevelExists(nodeLevelArr, node.level);
      if (!levelExists || levelExists === undefined) {
        node.expanded = false;
        nodeLevelArr.push(node.level);
      }
      if (levelExists && node.level !== 0) {
        node.expanded = false;
      } else {
        if (levelExists && node.level === 0) {
          nodeFound = false;
        }
      }
    }
  });
  params.api.onGroupExpandedOrCollapsed();
};
