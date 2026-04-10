import BookDetails from "@/components/BookDetails";
import PageHeader from "@/components/PageHeader";

export async function getStaticProps() {
  const response = await fetch("https://openlibrary.org/works/OL453657W.json");

  const data = await response.json();

  return {
    props: {
      book: data,
    },
  };
}

export default function About({ book }) {
  return (
    <>
      <PageHeader text="About the Developer" subtext="Bhavya Mahyavanshi" />

      <BookDetails book={book} workId="OL453657W" showFavouriteBtn={false} />
    </>
  );
}
