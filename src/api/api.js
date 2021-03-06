const API = {
    OSSUrl: 'http://47.99.200.198/service/aliyun-oss/getSign',
    Login: '/user/login',
    Logout: '/user/logout',
    Welcome: '/welcome',
    EditPageList: '/edit/pageList',
    EditInsertData: '/edit/insert',
    EditUpdateData:'/edit/update',
    EditDeleteData:'/edit/delete',
    AdminUserPageList:'/user/pageList',
    AdminUserInsert:'/user/insert',
    AdminUserUpdate:'/user/update',
    AdminUserDelete:'/user/delete',
    WithdrawPageList: '/withdraw/pageList',
    WithdrawConfirm: '/withdraw/confirm',
    WithdrawClose: '/withdraw/close',
    WithdrawImport: '/withdraw/import',
    ScenicLevelInsert: '/sceniclevel/insert',
    ScenicLevelUpdate: '/sceniclevel/update',
    ScenicLevelDelete: '/sceniclevel/delete',
    ScenicLevelPageList: '/sceniclevel/pageList',
    ScenicSpotInsert: '/scenicspot/insert',
    ScenicSpotUpdate: '/scenicspot/update',
    ScenicSpotDelete: '/scenicspot/delete',
    ScenicSpotPageList: '/scenicspot/pageList',
    HomeArticlePageList: 'homeArticle/pageList',
    HomeArticleInsert: 'homeArticle/insert',
    HomeArticleUpdate: 'homeArticle/update',
    HomeArticleDelete: 'homeArticle/delete',
    AdvTypePageList: 'advboardtype/pageList',
    AdvTypeInsert: 'advboardtype/insert',
    AdvTypeUpdate: 'advboardtype/update',
    AdvTypeDelete: 'advboardtype/delete',
    AdvInfoPageList: 'advboardinfo/pageList',
    AdvInfoInsert: 'advboardinfo/insert',
    AdvInfoUpdate: 'advboardinfo/update',
    AdvInfoDelete: 'advboardinfo/delete',
    SysMsgPageList: 'sysmsg/pageList',
    SysMsgInsert: 'sysmsg/insert',
    SysMsgUpdate: 'sysmsg/update',
    SysMsgDelete: 'sysmsg/delete',
    cacheItem: 'http://47.99.200.198:19080/service/edit/cacheItem', // service相关接口
    /**订单确认发货*/
    DeliverChargeOrder: 'http://47.99.200.198:19080/service/charge-order-backend/deliverChargeOrder',
    /**导出VipCard Excel*/
    ExportVipCard: 'http://47.99.200.198:19080/service/charge-order-backend/exportVipCard',
    /**导出挪车卡列表Excel*/
    ExportParkCard: 'http://47.99.200.198:19080/service/charge-order-backend/exportParkCard',
    /**获取细银特权订单列表*/
    GetChargeOrderList: 'http://47.99.200.198:19080/service/charge-order-backend/getChargeOrderList',
    /**查询订单下的所有卡片信息*/
    OrderDetail: 'http://47.99.200.198:19080/service/charge-order-backend/orderDetail'
}

export default API