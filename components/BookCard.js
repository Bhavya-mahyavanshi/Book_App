import useSWR from "swr";
import Error from "next/error";
import { Card, Button } from "react-bootstrap";
import Link from "next/link";

export default function BookCard({ workId }) {
  const { data, error } = useSWR(
    `https://openlibrary.org/works/${workId}.json`,
  );

  if (error || !data) {
    return <Error statusCode={404} />;
  }

  return (
    <Card>
      <Card.Img
        variant="top"
        onError={(event) => {
          event.target.onerror = null;
          event.target.src =
            "https://placehold.co/400x600?text=Cover+Not+Available";
        }}
        className="img-fluid w-100"
        src={`https://covers.openlibrary.org/b/id/${data?.covers?.[0]}-M.jpg`}
      />

      <Card.Body>
        <Card.Title>{data?.title || ""}</Card.Title>

        <Card.Text>{data?.first_publish_date || "N/A"}</Card.Text>

        <Link href={`/works/${workId}`} passHref>
          <Button>View</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
