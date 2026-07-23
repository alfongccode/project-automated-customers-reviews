from .data_preprocessing import data_frame_preprocessing

def clean_categories_columns(pdSerie):
  return pdSerie.str.replace(",", " ").str.strip()

def clean_data_frame(df):
    # Get columns containing relevant information
    df_2 = df[['name', 'brand', 'asins', 'categories', 'manufacturer', 'reviews.date', 'reviews.username', 'primaryCategories', 'reviews.rating', 'reviews.text', 'reviews.title', 'reviews.dateSeen']]

    # Remove duplicate reviews on dataFrame
    df_2.drop_duplicates(subset=['name', 'reviews.username', 'reviews.title', 'reviews.text'], inplace=True)

    # Remove two products without primary key product identifier
    df_2.dropna(subset=['asins'], inplace=True)

    # Drop products without a 'name' and a 'review.text' because it is a vital field
    df_2.dropna(subset=['reviews.text'], inplace=True)

    # Drop all empty names to prevent noise because there are a little percentaje
    df_2 = df_2.dropna(subset=['name'])

    # Fill missing categories and usernames with 'unknown' because this is critical data
    df_2['primaryCategories'] = df_2['primaryCategories'].fillna('')
    df_2['reviews.username'] = df_2['reviews.username'].fillna('unknown')

    # Fill missing titles to 'no title' because capturing the review text is more critical
    df_2['reviews.title'] = df_2['reviews.title'].fillna('no title')

    # Fill missing ratings with averange rating data
    df_2['reviews.rating'] = df_2['reviews.rating'].fillna(df_2['reviews.rating'].mean())

    # Join amazonbasics and amazonBasics brand as a typo in the same brand
    df_2['brand'] = df_2['brand'].apply(lambda brand_name: 'Amazon Basics' if brand_name.lower().strip() == 'amazonbasics' else brand_name)

    # Fill missing review dates with the last date seen to avoid NaN values, as this is the assumed review date. Then drop date seen column.
    df_2['reviews.date'] = df_2['reviews.date'].fillna(df_2['reviews.dateSeen'])
    df_2.drop(columns=['reviews.dateSeen'], inplace=True)

    # Clean punctuation and stopwords from text categories
    df_2 = data_frame_preprocessing(df_2, ['name', 'categories', 'primaryCategories', 'reviews.title', 'reviews.text'])

    # Join all categories to improve the categories signal
    df_2['tags'] = clean_categories_columns(df_2['categories']) + " " + clean_categories_columns(df_2['primaryCategories'])
    
    return df_2