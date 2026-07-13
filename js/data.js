// ============================================
// 메뉴/카테고리 데이터
// ============================================

const CATEGORIES = [
  { id: 'coffee', name: '커피' },
  { id: 'tea', name: '차' },
  { id: 'bakery', name: '베이커리' },
  { id: 'dessert', name: '디저트' }
];

const MENU_ITEMS = [
  { id: 1, name: '에스프레소', category: 'coffee', price: 2500, description: '진한 원샷 에스프레소', image: '/images/menu/1.jpg' },
  { id: 2, name: '아메리카노', category: 'coffee', price: 3500, description: '물과 에스프레소의 조화', image: '/images/menu/2.jpg' },
  { id: 3, name: '카페라떼', category: 'coffee', price: 4200, description: '부드러운 우유와 에스프레소', image: '/images/menu/3.jpg' },
  { id: 4, name: '카푸치노', category: 'coffee', price: 4500, description: '우유 거품이 풍부한 카푸치노', image: '/images/menu/4.jpg' },
  { id: 5, name: '모카', category: 'coffee', price: 4800, description: '초콜릿과 커피의 만남', image: '/images/menu/5.jpg' },
  { id: 6, name: '바닐라 라떼', category: 'coffee', price: 4800, description: '바닐라 시럽이 들어간 라떼', image: '/images/menu/6.jpg' },
  { id: 7, name: '녹차', category: 'tea', price: 3200, description: '순수한 일본 녹차', image: '/images/menu/7.jpg' },
  { id: 8, name: '아이스티', category: 'tea', price: 3500, description: '상쾌한 레몬 아이스티', image: '/images/menu/8.jpg' },
  { id: 9, name: '캐모마일', category: 'tea', price: 3500, description: '천연 허브의 은은한 향', image: '/images/menu/9.jpg' },
  { id: 10, name: '말차 라떼', category: 'tea', price: 4500, description: '진한 말차와 우유의 조화', image: '/images/menu/10.jpg' },
  { id: 11, name: '크로아상', category: 'bakery', price: 2800, description: '바삭한 버터 크로아상', image: '/images/menu/11.jpg' },
  { id: 12, name: '번', category: 'bakery', price: 2500, description: '부드러운 밀크 번', image: '/images/menu/12.jpg' },
  { id: 13, name: '머핀', category: 'bakery', price: 3000, description: '블루베리 머핀', image: '/images/menu/13.jpg' },
  { id: 14, name: '쿠키', category: 'bakery', price: 2200, description: '초콜릿칩 쿠키', image: '/images/menu/14.jpg' },
  { id: 15, name: '티라미수', category: 'dessert', price: 5500, description: '전통 이탈리아 티라미수', image: '/images/menu/15.jpg' },
  { id: 16, name: '츄러스', category: 'dessert', price: 4800, description: '크리스피 바깥, 부드러운 속', image: '/images/menu/16.jpg' },
  { id: 17, name: '젤라토', category: 'dessert', price: 4200, description: '이탈리아산 아이스크림', image: '/images/menu/17.jpg' },
  { id: 18, name: '생크림 케이크', category: 'dessert', price: 5200, description: '스트로베리 생크림 케이크', image: '/images/menu/18.jpg' }
];

// ============================================
// 메뉴 옵션
// ============================================

const MENU_OPTIONS = {
  temperature: {
    label: '온도',
    choices: [
      { id: 'hot', name: 'HOT', priceDelta: 0 },
      { id: 'ice', name: 'ICE', priceDelta: 0 }
    ]
  },
  size: {
    label: '사이즈',
    choices: [
      { id: 'regular', name: 'Regular', priceDelta: 0 },
      { id: 'large', name: 'Large', priceDelta: 500 }
    ]
  },
  shot: {
    label: '샷 추가',
    choices: [
      { id: 'none', name: '없음', priceDelta: 0 },
      { id: 'extra1', name: '1샷 추가', priceDelta: 500 },
      { id: 'extra2', name: '2샷 추가', priceDelta: 1000 }
    ]
  },
  milk: {
    label: '우유 변경',
    choices: [
      { id: 'regular', name: '일반 우유', priceDelta: 0 },
      { id: 'skim', name: '저지방 우유', priceDelta: 300 },
      { id: 'soy', name: '두유', priceDelta: 700 },
      { id: 'oat', name: '오트밀크', priceDelta: 700 }
    ]
  },
  syrup: {
    label: '시럽',
    choices: [
      { id: 'none', name: '없음', priceDelta: 0 },
      { id: 'vanilla', name: '바닐라', priceDelta: 300 },
      { id: 'caramel', name: '카라멜', priceDelta: 300 },
      { id: 'hazelnut', name: '헤이즐넛', priceDelta: 300 }
    ]
  },
  whip: {
    label: '휘핑크림',
    choices: [
      { id: 'none', name: '없음', priceDelta: 0 },
      { id: 'add', name: '휘핑크림 추가', priceDelta: 500 }
    ]
  }
};

// 카테고리별로 적용되는 옵션 종류 (베이커리/디저트는 옵션 없음)
const CATEGORY_OPTIONS = {
  coffee: ['temperature', 'size', 'shot', 'milk', 'syrup', 'whip'],
  tea: ['temperature', 'size', 'syrup'],
  bakery: [],
  dessert: []
};

// ============================================
// 주문 상태
// ============================================

const ORDER_STATUS = {
  PENDING:    { value: 'pending',   label: '결제 완료' },
  CONFIRMED:  { value: 'confirmed', label: '확인됨' },
  PREPARING:  { value: 'preparing', label: '조리중' },
  READY:      { value: 'ready',     label: '준비완료' },
  COMPLETED:  { value: 'completed', label: '완료' },
  CANCELLED:  { value: 'cancelled', label: '취소' }
};
