import { useRouter } from "next/router";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default function Books() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  let queryString = { ...router.query };
  let qParts = [];

  Object.entries(queryString).forEach(([key, value]) => {
    qParts.push(`${key}:${value}`);
  });

  if (qParts.length > 0) {
    queryString = qParts.join(" AND ");
  }

  const { data, error } = useSWR(
    `https://openlibrary.org/search.json?q=${queryString}&page=${page}&limit=10`,
  );

  useEffect(() => {
    setPage(1);
  }, [router.query]);

  if (!data) return null;

  if (error) return <p>Error loading data...</p>;

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  return (
    <>
      <PageHeader
        text="Search Results"
        subtext={Object.entries(router.query)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")}
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>First Publish Year</th>
          </tr>
        </thead>

        <tbody>
          {data.docs.map((book) => (
            <tr key={book.key}>
              <td>
                <Link href={`/works/${book.key.replace("/works/", "")}`}>
                  {book.title}
                </Link>
              </td>

              <td>{book.author_name ? book.author_name.join(", ") : "N/A"}</td>

              <td>{book.first_publish_year || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={previousPage} disabled={page === 1} />

        <Pagination.Item>{page}</Pagination.Item>

        <Pagination.Next onClick={nextPage} />
      </Pagination>
    </>
  );
}
