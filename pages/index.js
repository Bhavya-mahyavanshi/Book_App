/*********************************************************************************
* WEB422 – Assignment 3
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
* Name: Bhavya Mahyavanshi Student ID: 178233235 Date: April 10, 2026
*
* Vercel App (Deployed) Link: ___________________________________________________
*
********************************************************************************/

import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import PageHeader from "@/components/PageHeader";

export default function Home() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function submitForm(data) {
    router.push({
      pathname: "/books",
      query: Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== ""),
      ),
    });
  }

  return (
    <>
      <PageHeader text="Search Books" subtext="Find books from OpenLibrary" />

      <Form onSubmit={handleSubmit(submitForm)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Author *</Form.Label>
              <Form.Control
                {...register("author", { required: true })}
                className={errors.author ? "is-invalid" : ""}
              />
              {errors.author && (
                <div className="invalid-feedback">Author is required</div>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control {...register("title")} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control {...register("subject")} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Control {...register("language")} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Publish Year</Form.Label>
              <Form.Control {...register("first_publish_year")} />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit">Search</Button>
      </Form>
    </>
  );
}
