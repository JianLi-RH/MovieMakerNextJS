import { getPostData } from "@/lib/help";

export default async function Page({ params }: { params: { help: string } }) {
  const helpData = await getPostData(params.help);
  return (
    <div className="md:container md:mx-auto">
      <article>
        <main dangerouslySetInnerHTML={{ __html: helpData.contentHtml }} />
      </article>
    </div>
  );
}