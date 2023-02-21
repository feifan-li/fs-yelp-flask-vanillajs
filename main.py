# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from flask import Flask, request, jsonify
import requests
# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
yelpApiKey = "taNQtjZSHCNT28G1iBeYOtZcp3Gb8KaxJQW6Z61mTVeumwl0VtKTKPXq-EVpW9ik2CXidk5gfVZQ_-FhhY3s7UrgmXAFxOYNa_iOXi9M0Y9pXd1JrxL7nPszrQ45Y3Yx"
yelpClientID = "sgCfUbG78fQEH4w5HbB2Sg"
headers={'Authorization':'Bearer %s' % yelpApiKey}

business_search_URL='https://api.yelp.com/v3/businesses/search'
business_details_URL='https://api.yelp.com/v3/businesses'

app = Flask(__name__,static_url_path='/static')



@app.route('/',methods=["GET","POST"])
def hello():
    """Return a friendly HTTP greeting."""
    # return 'Hello World!'
    return app.send_static_file('business.html')

@app.route("/searchyelp",methods=["GET"])
def getFormInput():
    if request.method=="GET":
        key_val = request.args.get('key','')
        latitude = request.args.get('lat','')
        longtitude = request.args.get('lng','')
        distance_val = request.args.get('distance','')##1mile = 1609.34 meters
        category_val = request.args.get('category','')
        if (category_val == 'default'):
            category_val= 'all'
        elif (category_val == 'hotels and travel'):
            category_val= 'hotels,hotelstravel,travelservices,tours'
        elif (category_val == 'food'):
            category_val= 'food,restaurants,gourmet'
        elif (category_val == 'arts and entertainment'):
            category_val= 'arts,artsandcrafts,bars,martialarts,nightlife'
        elif (category_val == 'health and medical'):
            category_val= 'health,medical'
        elif (category_val == 'professional services'):
            category_val= 'professional,services'
        else:
            category_val= 'all'
    ''' Refering to Yelp's sample code: https://github.com/Yelp/yelp-fusion/blob/master/fusion/python/sample.py'''
    params={
        'term':key_val.replace(' ','+'),
        'latitude':float(latitude),
        'longitude':float(longtitude),
        'radius':int(float(distance_val)*1609.34),
        'categories':category_val
        # 'limit':3
    }
    # print(params)
    response = requests.request('GET',business_search_URL, headers=headers,params=params)
    business = response.json()["businesses"]
    res = dict()
    for i in range(len(business)):
        business[i].pop("alias")
        business[i].pop("phone")
        res[business[i]["id"]] = business[i]
    print(res)
    return jsonify(res)

@app.route("/detailsyelp",methods=["GET"])
def get_details():
    id = request.args.get('id','')
    print(id)
    url = business_details_URL+'/'+id
    response = requests.request('GET',url,headers=headers)
    print(response.json())

    return response.json()

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='https://yelpsearch-ffl-v2.wl.r.appspot.com', port=8080, debug=True)
    # app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
