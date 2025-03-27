"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { BookCard } from "@/components/book-card"
import libraryDB, { type Book } from "@/lib/db"
import { categories } from "@/lib/data"

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const category = categories.find((c) => c.id === params.id)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await libraryDB.getBooks()
        const categoryBooks = allBooks.filter(
          (book) =>
            book.genre.toLowerCase() === params.id.toLowerCase() ||
            book.genre.toLowerCase().includes(params.id.toLowerCase()) ||
            params.id.toLowerCase().includes(book.genre.toLowerCase()),
        )
        setBooks(categoryBooks)
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [params.id])

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          {category && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <category.icon className="h-6 w-6" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold capitalize">{params.id}</h1>
            <p className="text-muted-foreground">
              {books.length} {books.length === 1 ? "book" : "books"} available
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="aspect-[2/3] animate-pulse rounded-lg bg-muted"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
              </div>
            ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            {category && <category.icon className="h-12 w-12 text-muted-foreground" />}
          </div>
          <h2 className="mt-4 text-xl font-semibold">No books found</h2>
          <p className="mt-2 text-muted-foreground">There are no books in this category yet.</p>
          <Link href="/">
            <button className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Browse All Books
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

