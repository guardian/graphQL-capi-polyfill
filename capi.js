/* @flow */

import request from 'request';
import {CAPI_URL} from './config';

function makeRequest(url) {
    console.log("Requesting: " + url);
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                reject("Could not request " + url);
                return;
            }

            try {
                var data = JSON.parse(body)
                var response = data.response;
                resolve(response);
            } catch (e) {
                reject("Could not parse response for " + url);
                return;
            }
        })
    });
}

function grabArticleData(article) {
    return {
        id: article.id,
        url: article.webUrl,
        sectionName: article.sectionName,
        headline: article.fields.headline,
        body: article.fields.main + article.fields.body,
        summary: article.fields.standfirst,
        publishDate: article.webPublicationDate
    }
}

function grabImageData(asset) {
    return {
      url: asset.typeData.secureFile || asset.file,
      copyright: asset.typeData.copyright,
      alt: asset.typeData.altText,
      width: parseInt(asset.typeData.width, 10),
      height: parseInt(asset.typeData.height, 10)
    }
}

export function getArticle(path: String): Promise {
    return makeRequest(CAPI_URL + "/" + path + "?show-fields=all").then((response) => {
        return new Promise((resolve,reject) => {
            resolve(grabArticleData(response.content));
        });
    });
}

export function getRelatedArticles(path: String): Promise {
    return makeRequest(CAPI_URL + "/" + path + "?show-fields=all&show-related=true").then((response) => {
        return new Promise((resolve,reject) => {
            resolve(response.relatedContent.map(grabArticleData));
        });
    });
}

export function getNewestArticles(): Promise {
    return makeRequest(CAPI_URL + "/search?order-by=newest&show-fields=all&show-related=true").then((response) => {
        return new Promise((resolve,reject) => {
            resolve(response.results.map(grabArticleData));
        });
    });
}

export function getMainArticleImage(path: String, width: number): Promise {
    return makeRequest(CAPI_URL + "/" + path + "?show-elements=all").then((response) => {
        return new Promise((resolve,reject) => {
            var mainImages = response.content.elements
              .filter((element) => element.relation === "main")
              .filter((element) => element.type === "image")

            if (!mainImages.length) {
                reject('No main images found for this article')
                return;
            }

            var matchingImage = mainImages[0].assets
              .filter((asset) => asset.typeData.width >= width)
              .sort((a, b) => a.typeData.width - b.typeData.width)[0]

            if (!matchingImage) {
                reject('No images large enough found')
                return
            }

            resolve(grabImageData(matchingImage));
        });
    });
}
