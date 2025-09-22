import NPPage from "../components/np/NPPage";
import { getNPStaticProps } from "../lib/np-utils";

const cssFile = "../styles/scoped/np-home.css";
export const getStaticProps = getNPStaticProps("index.html");

export default function Home({ html }) {
  return <NPPage html={html} cssFile={cssFile} title="Home" />;
}
