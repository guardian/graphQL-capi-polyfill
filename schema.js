/* @flow */

import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLInt
} from 'graphql';

import {
    getArticle,
    getRelatedArticles,
    getNewestArticles,
    getMainArticleImage
} from './capi';

var imageType = new GraphQLObjectType({
    name: 'Image',
    description: 'An Image',
    fields: () => ({
        url: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The public url of the image.',
        },
        copyright: {
            type: GraphQLString,
            description: "Who own the copyright to the image"
        },
        alt: {
            type: GraphQLString,
            description: "The suggested alt text for the image"
        },
        width: {
            type: GraphQLInt,
            description: "The width of the image in px"
        },
        height: {
            type: GraphQLInt,
            description: "The height of the image in px"
        }
    })
});


var articleType = new GraphQLObjectType({
    name: 'Article',
    description: 'An article',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The id of the article.',
        },
        webUrl: {
            type: GraphQLString,
            description: 'The url of the article.',
        },
        sectionName: {
            type: GraphQLString,
            description: 'The section name of the article.',
        },
        headline: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The headline of the article.',
        },
        body: {
          type: GraphQLString,
          description: "The HTML body of the Article"
        },
        summary: {
          type: GraphQLString,
          description: "A Summary of the Article (Standfirst)"
        },
        publishDate: {
          type: GraphQLString,
          description: "The date this content was published"
        },
        relatedArticles: {
            type: new GraphQLList(articleType),
            resolve: article => getRelatedArticles(article.id),
        },
        mainImage: {
            type: imageType,
            resolve: (article, { width }) => getMainArticleImage(article.id, width),
            args: {
                width: {
                    description: 'Specify a width for the image, will get the image closet to that size (never smaller)!',
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
        }
    })
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        article: {
            type: articleType,
            args: {
                path: {
                    description: 'Fetch a single article!',
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, { path }) => getArticle(path),
        },
        newest: {
            type: new GraphQLList(articleType),
            resolve: (root) => getNewestArticles()
        }
    })
});

export default new GraphQLSchema({
    query: queryType
});
