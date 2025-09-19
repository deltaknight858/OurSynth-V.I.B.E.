import NPPage, { getNPStaticProps } from "../components/np/NPPage";
const cssFile = "../styles/scoped/np-history.css";
export const getStaticProps = getNPStaticProps("history.html");

export default function History({ html }) {
  return <NPPage html={html} cssFile={cssFile} title="History" />;
}
import BaseLayout from '../components/layout/BaseLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NPPage from '../components/np/NPPage';

export default function History() {
  return (
    <BaseLayout>
      <Header />
      <NPPage htmlFile="history.html" />
      <Footer />
    </BaseLayout>
  );
}
