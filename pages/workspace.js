import NPPage, { getNPStaticProps } from "../components/np/NPPage";
const cssFile = "../styles/scoped/np-workspace.css";
export const getStaticProps = getNPStaticProps("workspace.html");

export default function Workspace({ html }) {
  return <NPPage html={html} cssFile={cssFile} title="Workspace" />;
}
import BaseLayout from '../components/layout/BaseLayout';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NPPage from '../components/np/NPPage';

export default function Workspace() {
  return (
    <BaseLayout>
      <Header />
      <NPPage htmlFile="workspace.html" />
      <Footer />
    </BaseLayout>
  );
}
