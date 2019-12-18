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

export const ViewChart = params => {
  const data = [];
  let stats: object;
  let totalDebit = 0;
  let totalCredit = 0;
  let tableHeader;
  params.api.forEachNode((node, index) => {
    if (node.group && node.level === 0) {
      tableHeader = node.columnApi.columnController.rowGroupColumns[0].colDef.headerName;
      data.push({
        AccountCategory: node.key,
        debit: node.data.debit,
        credit: node.data.credit,
        debitPercentage: 0,
        creditPercentage: 0,
        balance: node.data.balance
      });
      totalDebit += node.data.debit;
      totalCredit += node.data.debit;
    }
  });
  stats = {
    totalDebit,
    totalCredit
  };
  data.forEach(row => {
    row.debitPercentage = (row.debit * 100) / totalDebit;
    row.creditPercentage = (row.credit * 100) / totalCredit;
  });
  const record = [tableHeader, { stats, data }];
  return record;
};

export const CustomItem = params => {
  return [
    {
      name: 'Expand',
      action() {
        Expand(params);
      }
    },
    {
      name: 'Collapse',
      action() {
        Collapse(params);
      }
    },
    {
      name: 'Expand All',
      action: () => {
        ExpandAll(params);
      }
    },
    {
      name: 'Collapse All',
      action: () => {
        CollapseAll(params);
      }
    }
  ];
};

export const DefaultItems = ['copy', 'paste', 'copyWithHeaders', 'export'];

export const GetContextMenu = (
  isDefaultItems,
  addDefaultItems,
  isCustomItems,
  addCustomItems,
  params
) => {
  let allDefaultItems;
  let allCustomItems;

  if (isDefaultItems) {
    allDefaultItems = DefaultItems;
  } else {
    allDefaultItems = [...addDefaultItems, ...DefaultItems];
  }

  if (isCustomItems) {
    allCustomItems = CustomItem(params);
  } else {
    allCustomItems = [...addCustomItems, ...CustomItem(params)];
  }

  if (params.node.group) {
    return allCustomItems;
  }
  return allDefaultItems;
};
