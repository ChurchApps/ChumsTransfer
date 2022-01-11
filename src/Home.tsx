import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Footer, Header } from "./components"

export const Home = () => (
  <>
    <Header />
    <Container>
      <h1>Import/Export Tool</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper et magna in imperdiet. Pellentesque nec fermentum neque, sed accumsan ex. Suspendisse eu turpis vel mi bibendum dictum quis non nibh. Aliquam venenatis urna ac purus mattis aliquam. Nulla facilisi. In placerat ex congue, eleifend dolor sit amet, molestie magna. Aliquam imperdiet lacinia arcu eget accumsan. Nunc pulvinar facilisis porttitor. Quisque commodo nisl quam, nec posuere elit bibendum nec. Nam lacinia, odio et elementum tempor, purus dolor eleifend dui, in imperdiet ligula metus eget dui.</p>

      <p>Sed semper dolor nulla, at pretium est placerat sed. Quisque tempor, odio quis iaculis bibendum, sapien tortor blandit est, quis vulputate leo tortor id dolor. Quisque sed ornare nunc, eu congue neque. Integer bibendum porttitor purus, sed cursus purus tincidunt vitae. Morbi ipsum urna, molestie id posuere in, luctus sit amet quam. Mauris pellentesque dolor a purus mollis iaculis a eget enim. Etiam et venenatis nibh, ac aliquam urna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque tristique accumsan iaculis. Donec ut dolor augue. Proin sed felis elementum diam eleifend maximus. Morbi dictum et tortor eu condimentum.</p>
      <hr />
      <h2>Step 1 - Import Source</h2>
      <Button variant="primary">Next Step</Button>

      <hr />
      <Link to={"/settings/import"}>Temp Link to Old Import</Link><br />
      <Link to={"/settings/export"}>Temp Link to Old Export</Link><br />
      <br /><br />

    </Container>
    <Footer />
  </>
)