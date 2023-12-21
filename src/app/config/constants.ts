export class Constants {
  public static readonly ALL_LANGUAGES = 'all-languages';
  public static readonly SELECT_LANGUAGES = 'select-languages';
  public static readonly AUTH_TOKEN = 'authToken';
  public static readonly AUTH_USER = 'authUser';

  public static readonly FCM_TOKEN = 'fcmToken';

  public static readonly PRODUCT_DATA = 'productData';
  public static readonly CATALOG_VERSION = 'catalogversion';

  public static readonly SELLING_TYPE = 'sellingType';
  public static readonly SELECT_PREFERENCE = 'select-preference';
  public static readonly SELECT_CITY = 'select-city';
  public static readonly SELECTED_CATEGORIES = 'selectedCategories';
  public static readonly SHOP_ADDRESS = 'shop-address';
  public static readonly SHOP_ID = 'shop-id';
  public static readonly SHOP_GST = 'shop-gst';
  public static readonly KYC_DETAILS = 'kycDetails';
  public static readonly BANK_DETAILS = 'bankDetails';
  public static readonly WORKING_HOURS = 'working-hours';
  public static readonly PROFILE_URL = 'profileUrl';
  public static readonly SHOP_NAME = 'shopName';
  public static readonly ACTIVE_SUBSCRIPTION_FLAG = 'retailer-subscrition';
  public static readonly SELECTED_PRODUCT = 'selected_product';
  public static readonly HELP_VIDEOS ='help-Videos';
  /* Pay */
  public static readonly AMOUNT = '39900';
  public static readonly PAY_IMAGE = 'https://sarvm.ai/images/app/retailerlogo.png';
  public static readonly CURRENCY = 'INR';
  public static readonly APP_NAME = 'Sarvm';
  public static readonly APP_PRIMARY_COLOR = '#4db965';
}

export const EmailCheck = (email) => {
  let emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const PhoneCheck = (phone) => {
  let phoneRegex = /^\d{10}$/;
  let number: any = parseInt(phone);
  return phoneRegex.test(number);
};

export const ApiUrls = {
  splash: '/rms/apis/v1/splash',
  image: '/ums/apis/v1/employee/upload',
  /**
   * api url's for catalog
   */
  catalog: {
    catelog: '/rms/apis/v1/catalog/',
    category: '/hms/apis/v1/households/categories',
    stores: '/hms/apis/v1/households/stores',
    retailerCatalog: '/rms/apis/v1/catalog/',
  },
  /**
   * api url's for auth
   */
  auth: {
    sendOtp: '/ums/apis/v1/users/send_otp',
    verifyOtp: '/ums/apis/v1/users/verify_otp',
  },
  /**
   * api url's for subscription
   */
  subscription: {
    createSubscription: '/sub/apis/v1/subscription/initiateV2',
    confirmSubscription: '/sub/apis/v1/subscription/activateV2',
    getAllSubscription: '/sub/apis/v1/subscription/',
    checkStatus: '/sub/apis/v1/subscription/status/',
    SubscriptionsPackageList: '/sub/apis/s3/master'
  },
  /**
   * api url's for order's
   */
  orders: {
    orders: '/orders',
    getAllOrders: '/oms/apis/v1/shop/',
    updateOrders: '/oms/apis/v1/shop/update/',
    getOrder: "/rms/apis/v1/orders?status=",
    getOrderById: "/rms/apis/v1/orders/",
    getOrderAggregationbyId: '/report/apis/v1/report/order-aggregation-report/',
    updateOrderStatus: '/rms/apis/v1/orders/',
    updatePayment: '/rms/apis/v1/orders/',
  },
  /**
   * api url's for fetching and sending shop details
   */
  shopDetails: {
    shop: {
      addshop: '/rms/apis/v1/shop',
      addShopTime: `/rms/apis/v1/time/`,
      getShopOwnerDetails: '/rms/apis/v2/shop/',
      getShopDetails: '/rms/apis/v1/shop/details',
      updateShopDetails: '/rms/apis/v1/shop',
    },
    /**
     * api url's for banking related sevices
     */
    bank: {
      getBankURLDOC: '/onbs/apis/v1/onboarding/retailer/bank/uploadfile',
      addBank: '/onbs/apis/v1/onboarding/retailer/bank',
    },
    /**
     * api url's for gst and kyc
     */
    kyc: {
      addgst: 'rms/apis/v1/shop/:shopid/gst',
      getGstDetails: '/rms/apis/v1/shop',
      getKycDetails: '/onbs/apis/v1/onboarding/retailer/kyc',
      getUploadPan: `/onbs/apis/v1/onboarding/retailer/kyc/pan`,
      getUploadAadhar: `/onbs/apis/v1/onboarding/retailer/kyc/aadhar`,
    },
  },
  userDetails: {
    user: '/ums/apis/v1/users',
    profileUpload: '/ums/apis/v1/users/upload',
    getUserDetails: '/ums/apis/v1/users/',
    qrCodeUpload: '/ums/apis/v1/users/QRcodeImage',
    retailerUpi: '/rms/apis/v1/retailers',
  },
  topCustomerReport: {
    existingCustomers: '/report/apis/v1/report/top-customer-report/',
    customerDetail: '/report/apis/v1/report/user-detailed-orders/',
  },
  addDeliveryBoy: '/rms/apis/v1/shop/delivery/createDeliveryBoy',
  laUser: '/rms/apis/v1/shop/delivery',
  laUserById: '/lms/apis/v1/profile',
  laUpdateUser: '/lms/apis/v1/deliveryBoy',
  getDboyList: "/rms/apis/v1/shop/delivery",
  getUserCreatedDelBoy: `/rms/apis/v1/shop/delivery/`,
  assignOrder: (orderId: any) => `/rms/apis/v1/orders/assign/${orderId}`,
  reAssignOrder: (orderId: any) => `/rms/apis/v1/orders/reAssign/${orderId}`,

};

