module.exports = {
  docs: [
    {
      type: 'category',
      label: '介绍',
      collapsed: false,
      items: [
        'introduction/getting-started',
        'introduction/why-use-react-redux',
      ],
    },
    {
      type: 'category',
      label: '教程',
      collapsed: false,
      items: [
        'tutorials/quick-start',
        'tutorials/typescript-quick-start',
        'tutorials/connect',
      ],
    },
    {
      type: 'category',
      label: '使用 React Redux',
      collapsed: false,
      items: [
        'using-react-redux/usage-with-typescript',
        'using-react-redux/connect-mapstate',
        'using-react-redux/connect-mapdispatch',
        'using-react-redux/accessing-store',
      ],
    },
    {
      type: 'category',
      label: 'API 参考',
      items: ['api/provider', 'api/hooks', 'api/connect', 'api/batch'],
    },
    {
      type: 'category',
      label: '指南',
      items: ['troubleshooting'],
    },
  ],
}
