// Response DTOs
export class ResponseDto {
  constructor(isSuccess = false, message = '', result = null) {
    this.isSuccess = isSuccess;
    this.message = message;
    this.result = result;
  }
}

// Request DTOs
export class RequestDto {
  constructor(url = '', apiType = 'GET', data = null, contentType = 'application/json') {
    this.url = url;
    this.apiType = apiType;
    this.data = data;
    this.contentType = contentType;
  }
}

// Auth DTOs
export class LoginRequestDto {
  constructor(userName = '', password = '') {
    this.userName = userName;
    this.password = password;
  }
}

export class LoginResponseDto {
  constructor(user = null, token = '') {
    this.user = user;
    this.token = token;
  }
}

export class RegistrationRequestDto {
  constructor(email = '', name = '', phoneNumber = '', password = '') {
    this.email = email;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }
}

export class UserDto {
  constructor(
    id = '',
    email = '',
    name = '',
    phoneNumber = '',
    roles = []
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.roles = roles;
  }
}

// Product DTOs
export class ProductDto {
  constructor(
    productId = 0,
    name = '',
    price = 0,
    description = '',
    categoryName = '',
    imageUrl = '',
    image = null
  ) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.description = description;
    this.categoryName = categoryName;
    this.imageUrl = imageUrl;
    this.image = image;
  }
}

// Coupon DTOs
export class CouponDto {
  constructor(
    couponId = 0,
    couponCode = '',
    discountAmount = 0,
    minAmount = 0
  ) {
    this.couponId = couponId;
    this.couponCode = couponCode;
    this.discountAmount = discountAmount;
    this.minAmount = minAmount;
  }
}

// Cart DTOs
export class CartHeaderDto {
  constructor(
    cartHeaderId = 0,
    userId = '',
    couponCode = '',
    discount = 0,
    cartTotal = 0,
    name = '',
    phone = '',
    email = ''
  ) {
    this.cartHeaderId = cartHeaderId;
    this.userId = userId;
    this.couponCode = couponCode;
    this.discount = discount;
    this.cartTotal = cartTotal;
    this.name = name;
    this.phone = phone;
    this.email = email;
  }
}

export class CartDetailsDto {
  constructor(
    cartDetailsId = 0,
    cartHeaderId = 0,
    productId = 0,
    product = null,
    count = 0
  ) {
    this.cartDetailsId = cartDetailsId;
    this.cartHeaderId = cartHeaderId;
    this.productId = productId;
    this.product = product;
    this.count = count;
  }
}

export class CartDto {
  constructor(
    cartHeader = null,
    cartDetails = []
  ) {
    this.cartHeader = cartHeader || new CartHeaderDto();
    this.cartDetails = cartDetails;
  }
}

// Order DTOs
export class OrderHeaderDto {
  constructor(
    orderDetails = [],
    cartHeader = null
  ) {
    this.cartHeader = cartHeader;
    this.cartDetails = orderDetails;
  }
}

export class OrderDetailsDto {
  constructor(
    cartDetailsId = 0,
    cartHeaderId = 0,
    productId = 0,
    product = null,
    count = 0,
    name = '',
    phone = '',
    email = '',
    cartHeader = null
  ) {
    this.cartDetailsId = cartDetailsId;
    this.cartHeaderId = cartHeaderId;
    this.productId = productId;
    this.product = product;
    this.count = count;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.cartHeader = cartHeader;
  }
}
