const BOOKS = [
  {
    id: '978-0321765723',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 15.99,
    description: 'A shocking psychological thriller about a woman’s act of violence against her husband—and of the therapist obsessed with uncovering her motive.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg',
    category: 'Thriller',
    inStock: true,
    reviews: [
      { id: 1, user: 'MysteryFan', rating: 5, comment: 'Couldn\'t put it down! A true page-turner.' },
      { id: 2, user: 'Bookworm', rating: 4, comment: 'Great twist, though the ending felt a bit rushed.' }
    ]
  },
  {
    id: '978-1234567890',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: 12.50,
    description: 'A beautiful and heartbreaking story about a young girl who raises herself in the marshes of North Carolina, and the mystery surrounding a local boy\'s death.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780735219106-L.jpg',
    category: 'Fiction',
    inStock: true,
    reviews: [
      { id: 3, user: 'NatureLover', rating: 5, comment: 'Stunning prose and a compelling plot.' },
      { id: 4, user: 'Reader101', rating: 5, comment: 'A modern classic. Highly recommend.' }
    ]
  },
  {
    id: '978-0000000001',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 22.99,
    description: 'An easy and proven way to build good habits and break bad ones. Clear provides a practical framework for improving every day.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    category: 'Self-Help',
    inStock: true,
    reviews: [
      { id: 5, user: 'ProductivityPro', rating: 5, comment: 'Life-changing advice. Simple and effective.' }
    ]
  },
  {
    id: '978-1111111111',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 9.99,
    description: 'A classic novel of the Jazz Age, exploring themes of decadence, idealism, resistance to change, social upheaval, and excess.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
    category: 'Classic',
    inStock: false,
    reviews: []
  }
];

export default BOOKS;
