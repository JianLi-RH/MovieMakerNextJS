import { getAllHelpIds, getPostData } from "@/lib/help";
import RootLayout from "../layout";
import Layout from "./layout";

Page.getLayout = (page) => (
  <RootLayout>
    <Layout>{page}</Layout>
  </RootLayout>
);

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const paths = await getAllHelpIds();
  console.log("paths: ", paths);
  return paths.map((path) => ({
    help: path.params.id,
  }));
}

export default async function Page({ params }) {
  console.log("params.id: ", params.help);
  const helpData = await getPostData(params.help);
  return <main dangerouslySetInnerHTML={{ __html: helpData.contentHtml }} />;
}

// export default async function Page({ params }: { params: { help: string } }) {
//   const helpData = await getPostData(params.help);
//   return (
//     <div className="md:container md:mx-auto">
//       <article>
//         <main dangerouslySetInnerHTML={{ __html: helpData.contentHtml }} />
//       </article>
//     </div>
//   );
// }
