const state = {
  loginUserId: '',
  // 菜单项
  menuList: [{
      name: 'welcome',
      icon: 'el-icon-d-arrow-right',
      title: '首页'
    },
    // {
    //   name: 'MenuManagement',
    //   icon: 'el-icon-tickets',
    //   title: '栏目管理',
    //   subItems: [{
    //     name: 'MenuList',
    //     icon: 'el-icon-check',
    //     title: '栏目列表'
    //   }]
    // }, 
    {
      name: 'HomeSetting',
      icon: 'el-icon-tickets',
      title: '首页设置',
      role: 'SUPPER_ADMIN',
      subItems:[
          // {
          //     name: 'HomeArticle',
          //     title: '首页广告'
          // },
          {
              name: 'AdvType',
              title: '广告位类型'
          },
          {
              name: 'AdvInfo',
              title: '广告位'
          }
      ]
    },
    {
      name: 'Area',
      icon: 'el-icon-tickets',
      title: '细银专区',
      role: 'Area_Top',
      subItems:[
          {
              name: 'Area',
              title: '专区头条单品'
          },
          {
              name: 'Arealife',
              title: '品质生活'
          },
          {
              name: 'Areahome',
              title: '居家物品'
          },
      ]
    },
    {
      name: 'Circle',
      icon: 'el-icon-tickets',
      title: '发圈',
      role: 'Circle_Bursting',
      subItems: [{
          name: 'Bursting',
          title: '每日爆款'
        },
        {
          name: 'Source',
          title: '宣传素材'
        },
        {
          name: 'School',
          title: '细银学堂'
        }
      ]
    },
    {
      name: 'FinanceManagement',
      icon: 'el-icon-tickets',
      title: '财务管理',
      role: 'SUPPER_ADMIN',
      subItems: [{
        name: 'WithdrawList',
        // icon: 'el-icon-check',
        title: '提现记录'
      }]
    },
    {
      name: 'TravelManagement',
      icon: 'el-icon-tickets',
      title: '旅游景区管理',
      role: 'TRAVEL_MANAGE',
      subItems: [{
        name: 'ScenicSpotList',
        // icon: 'el-icon-check',
        title: '景区景点'
      }, {
        name: 'ScenicStrategy',
        // icon: 'el-icon-check',
        title: '景区攻略'
      }, {
        name: 'ScenicLevel',
        // icon: 'el-icon-check',
        title: '景区级别'
      }]
    },
    {
      name: 'AdminUserManagement',
      icon: 'el-icon-tickets',
      title: '后台用户管理',
      role: 'SUPPER_ADMIN',
      subItems: [{
        name: 'AdminUserList',
        // icon: 'el-icon-check',
        title: '后台用户列表'
      }]
    },
      {
          name: 'MessageSetting',
          icon: 'el-icon-tickets',
          title: '消息设置',
          role: 'SUPPER_ADMIN',
          subItems:[
              {
                  name: 'OfficialMsg',
                  title: '官方公告'
              },
              {
                  name: 'ActivityMsg',
                  title: '活动公告'
              }
          ]
      },
      {
          name: 'OrderManagement',
          icon: 'el-icon-tickets',
          title: '后台订单管理',
          role: 'SUPPER_ADMIN',
          subItems:[
              {
                  name: 'OrderListSingleVipCard',
                  title: '单VIP卡订单列表'
              },
              {
                  name: 'OrderListVipCard',
                  title: '多VIP卡订单列表'
              },
              {
                  name: 'OrderListParkCard',
                  title: '挪车卡订单列表'
              }
          ]
      }
  ],
  tabs: [],
  tabComponents: ['Welcome', 'AdvType', 'AdvInfo', 'Area', 'Arealife', 'Areahome', 'Circle', 'Bursting', 'Source', 'School', 'AdminUserList', 'WithdrawList', 'ScenicSpotList', 'ScenicLevel', 'ScenicStrategy',
  'OfficialMsg', 'ActivityMsg','OrderListSingleVipCard','OrderListVipCard','OrderListParkCard']
}

export default state