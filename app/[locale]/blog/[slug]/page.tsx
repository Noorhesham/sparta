import React from "react";
import { getLocale } from "next-intl/server";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Blog from "@/models/Blog";
import connectToDatabase from "@/lib/mongodb";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Paragraph from "@/app/components/defaults/Paragraph";

export const dynamic = "force-dynamic";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string; locale: string } }) {
  await connectToDatabase();
  const locale = params.locale;
  const blogModel = Blog as any;
  const post = await blogModel.findOne({ slug: params.slug }).lean();

  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: post.title[locale] || post.title.en,
    description: post.description[locale] || post.description.en,
    openGraph: {
      images: [{ url: post.mainImage }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  await connectToDatabase();
  const locale = await getLocale();

  // Fetch blog post data
  const blogModel = Blog as any;
  const postData = await blogModel.findOne({ slug: params.slug }).lean();

  if (!postData) {
    notFound();
  }

  // Parse the post data
  const post = JSON.parse(JSON.stringify(postData));

  // Format date
  const formattedDate = format(new Date(post.createdAt), "EEEE, d MMM yyyy");

  // Sort sections by order
  const orderedSections = [...post.sections].sort((a, b) => a.order - b.order);

  // Calculate estimated read time (average 200 words per minute)
  const calculateReadingTime = () => {
    let wordCount = 0;

    // Count words in title and description
    wordCount += post.title[locale]?.split(/\s+/).length || 0;
    wordCount += post.description[locale]?.split(/\s+/).length || 0;

    // Count words in text sections
    orderedSections.forEach((section) => {
      if (section.type === "text") {
        wordCount += section.content[locale]?.split(/\s+/).length || 0;
      }
    });

    const minutes = Math.ceil(wordCount / 200);
    return minutes < 1 ? 1 : minutes;
  };

  const readingTime = calculateReadingTime();

  // Fetch related posts (based on tags or same categories)
  const relatedPostsData = await blogModel
    .find({
      _id: { $ne: post._id }, // Exclude current post
      $or: [
        { tags: { $in: post.tags } }, // Same tags
        { published: true }, // Fallback to other published posts
      ],
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const relatedPosts = JSON.parse(JSON.stringify(relatedPostsData));

  return (
    <div className="bg-[#0F172A] ">
      <MaxWidthWrapper>
        {/* Back button */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center text-[#8B5CF6] hover:text-purple-400 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span>{locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}</span>
        </Link>

        {/* Hero section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{post.title[locale]}</h1>

          <div className="flex flex-wrap items-center text-gray-400 text-sm mb-6 gap-4">
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>
                {readingTime} {locale === "ar" ? "دقائق للقراءة" : "min read"}
              </span>
            </div>
          </div>
        </div>

        {/* Featured image with gradient overlay - matching the image style */}
        <div className="relative w-full aspect-[16/9] mb-10 rounded-lg overflow-hidden">
          <Image src={post.mainImage} alt={post.title[locale]} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-70"></div>
        </div>

        {/* Description */}
        <Paragraph
          content={post.description[locale]}
          locale={locale}
          className="text-lg text-gray-300 mb-10 leading-relaxed"
        />

        {/* Content sections */}
        <div className="prose prose-lg prose-invert max-w-none">
          {orderedSections.map((section, index) => {
            // Text section
            if (section.type === "text") {
              return (
                <div key={index} className="mb-8">
                  <Paragraph
                    content={section.content[locale]}
                    locale={locale}
                    isHtml={true}
                    className="text-gray-300 leading-relaxed"
                  />
                </div>
              );
            }

            // Image section
            if (section.type === "image") {
              return (
                <div key={index} className="mb-8">
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                    <Image src={section.imageUrl} alt={section.caption?.[locale] || ""} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-30"></div>
                  </div>
                  {section.caption && (
                    <p className="text-center text-sm text-gray-400 mt-2">{section.caption[locale]}</p>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 mb-12">
            <h3 className="text-white text-lg font-medium mb-3">{locale === "ar" ? "الوسوم" : "Tags"}</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full hover:bg-[#8B5CF6] hover:text-white transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-gray-800 pt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              {locale === "ar" ? "مقالات ذات صلة" : "Recent blog posts"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost: any) => (
                <Link key={relatedPost._id} href={`/${locale}/blog/${relatedPost.slug}`} className="group block">
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
                    <div className="relative w-full h-48">
                      <div
                        className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${relatedPost.thumbnailImage || relatedPost.mainImage})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <span className="text-xs text-gray-400 mb-2">
                        {format(new Date(relatedPost.createdAt), "EEEE, d MMM yyyy")}
                      </span>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-[#8B5CF6] transition-colors line-clamp-2">
                        {relatedPost.title[locale]}
                      </h3>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm text-white font-medium group-hover:text-[#8B5CF6] transition-colors">
                          {locale === "ar" ? "اقرأ المزيد" : "Read more"}
                        </span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back button (bottom) */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-[#8B5CF6] hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>{locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}</span>
          </Link>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
