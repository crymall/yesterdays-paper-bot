export interface NYTArticle {
  _id: string;
  abstract: string;
  byline: Byline;
  document_type: string;
  headline: Headline;
  keywords: any[];
  multimedia: Multimedia;
  news_desk: string;
  print_page: string;
  print_section: string;
  pub_date: string;
  section_name: string;
  snippet: string;
  source: string;
  subsection_name: string;
  type_of_material: string;
  uri: string;
  web_url: string;
  word_count: number;
}

export interface Byline {
  original: string;
}

export interface Headline {
  main: string;
  kicker: string | null;
  print_headline: string;
}

export interface Multimedia {
  caption: string;
  credit: string;
  default: any; 
  thumbnail: any;
}