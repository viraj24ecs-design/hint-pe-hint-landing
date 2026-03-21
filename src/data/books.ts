// Shared books data - single source of truth
// Any changes here will be reflected in LandingPage.tsx and edit_page_one.tsx

export interface Book {
  id: number;
  title: string;
  image: string;
  route: string;
}

export const books: Book[] = [
  { id: 1, title: "How To Bring Self-Discipline To Exercise", image: "/BookPics/How-To-Bring-Self-Discipline-To-Exercise.jpg", route: "/game/trial-book" },
  { id: 2, title: "", image: "", route: "/books/book1" },
  { id: 3, title: "", image: "", route: "/books/book2" },
  { id: 4, title: "", image: "", route: "/books/book3" },
  { id: 5, title: "", image: "", route: "/books/book4" },
  { id: 6, title: "", image: "", route: "/books/book5" },
  { id: 7, title: "", image: "", route: "/books/book6" },
  { id: 8, title: "", image: "", route: "/books/book7" },
  { id: 9, title: "", image: "", route: "/books/book8" },
  { id: 10, title: "", image: "", route: "/books/book9" },
  { id: 11, title: "", image: "", route: "/books/book10" },
  { id: 12, title: "", image: "", route: "/books/book11" },
];
