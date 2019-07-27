<?php

namespace app\modules\v1\controllers;

use Yii;
use yii\base\Model;
use yii\rest\Controller;
use yii\web\NotFoundHttpException;
use yeesoft\models\Menu;
use app\modules\v1\models\SeoComponent;
use yeesoft\page\models\Page;
// use yii\web\Controller;
use yii\data\Pagination;
use common\modules\post\models\Post;
use common\modules\hotel\models\Hotel;
use common\modules\hotel\models\Destination;
use common\modules\settings\models\SocialMediaSettings;
use common\modules\settings\models\GeneralSettings;
use common\modules\settings\models\HomeSettings;
use common\modules\testimonial\models\Testimonial;
use yeesoft\auth\models\forms\LoginForm;

class DefaultController extends Controller {

    public function actionIndex() {
        throw new \yii\web\HttpException(404, 'The requested Item could not be found.');
        throw new NotFoundHttpException("Unsuported action request", 100);
    }

    // Add to Mailing List
    public function actionSaveEmail()
    {
        $request = Yii::$app->request;
        $params = $request->get();
        if(!empty($params['email'])){
            $email = $params['email'];

            return [
                'success'=> true,
                'message'=> $email
            ];   
        }
        return [
            'success'=> false,
            'message'=> 'Please provide a valid email.'
        ];    
    }

    public function actionGetAllNavigation($menuType = 'main-menu', $lang = 'en-US') {

        $menuItems = Menu::getMenuItems($menuType);
        $allURL = array();
        foreach ($menuItems as $itemIndex => $menuItem) {
            $menuItems[$itemIndex] = array(
                'label' => $menuItem['label'],
                'visible' => (isset($menuItem['visible']) && $menuItem['visible']) ? 1 : 0,
                'url' => str_replace('/site/', '', $menuItem['url'][0]),
            );
            $allURL[] = str_replace('/site/', '', $menuItem['url'][0]);
        }

        //try to display static page from datebase
        $pages = Page::getDb()->cache(function ($db) {
            return Page::findAll(['status' => Page::STATUS_PUBLISHED]);
        }, 3600);
        foreach ($pages as $itemIndex => $page) {
            $currentIndex = $this->searchInArray($page->slug, "url", $menuItems);
            if ($currentIndex) {
                $menuItems[$currentIndex] = array(
                    'label' => $page->title,
                    'visible' => $menuItems[$currentIndex]['visible'],
                    'url' => $page->slug,
                    'view' => $page->view,
                    'layout' => $page->layout
                );
            } else {
                $menuItems[] = array(
                    'label' => $page->title,
                    'visible' => 0,
                    'url' => $page->slug,
                    'view' => $page->view,
                    'layout' => $page->layout
                );
            }
        }
        $menuItems[] = array(
            'label' => 'Hotel',
            'visible' => 0,
            'url' => 'hotel/:slug',
        );
        $menuItems[] = array(
            'label' => 'Explore',
            'visible' => 0,
            'url' => 'explore/:slug',
        );

        /* //try to display static page from datebase
          $posts = Post::getDb()->cache(function ($db) {
          return Post::findAll(['status' => Post::STATUS_PUBLISHED]);
          }, 3600);
          foreach($posts as $itemIndex=>$post){
          $currentIndex = $this->searchInArray($post->slug, "url", $menuItems);
          if($currentIndex){
          $menuItems[$currentIndex] = array(
          'label'=> $post->title,
          'visible'=> $menuItems[$currentIndex]['visible'],
          'url'=> $post->slug,
          'view' => $post->view,
          'layout'=> $post->layout
          );
          }else{
          $menuItems[] = array(
          'label'=> $post->title,
          'visible'=> 0,
          'url'=> $post->slug,
          'view' => $post->view,
          'layout'=> $post->layout
          );
          }
          }

          //try to display static page from datebase
          $hotels = Hotel::getDb()->cache(function ($db) {
          return Hotel::findAll(['status' => Hotel::STATUS_PUBLISHED]);
          }, 3600);
          foreach($hotels as $itemIndex=>$hotel){
          $currentIndex = $this->searchInArray($hotel->slug, "url", $menuItems);
          if($currentIndex){
          $menuItems[$currentIndex] = array(
          'label'=> $hotel->title,
          'visible'=> $menuItems[$currentIndex]['visible'],
          'url'=> $hotel->slug,
          'view' => $hotel->view,
          'layout'=> $hotel->layout
          );
          }else{
          $menuItems[] = array(
          'label'=> $hotel->title,
          'visible'=> 0,
          'url'=> $hotel->slug,
          'view' => $hotel->view,
          'layout'=> $hotel->layout
          );
          }
          } */

        /* $menuItems[] = array(
          'label'=> 'Login',
          'visible'=> 1,
          'url'=> 'login',
          'view' => 'page',
          'layout'=> 'main'
          ); */

        return [
            'error' => "",
            'response' => $menuItems,
            'success' => true
        ];
    }

    public function actionGetSeoUrl($url = "en") {
        if (!$url)
            $url = "en";
        $seoObj = new SeoComponent;
        $seo = $seoObj->loadMetaTags('/' . $url);
        return [
            'error' => "",
            'response' => [
                'title' => $seo->title,
                'author' => $seo->author,
                'keywords' => $seo->keywords,
                'description' => $seo->description,
                'index' => ($seo->index) ? 'index' : 'noindex',
                'follow' => ($seo->follow) ? 'follow' : 'nofollow',
            ],
            'success' => true
        ];
    }

    public function actionGetSocialMedia() {
        $model = new SocialMediaSettings();
        if (!$model)
            return [
                'error' => "No Model found",
                'response' => [],
                'success' => false
            ];

        return [
            'error' => "",
            'response' => [
                'fb_link' => $model->fb_link,
                'tw_link' => $model->tw_link,
                'yt_link' => $model->yt_link,
                'ld_link' => $model->ld_link,
                'in_link' => $model->in_link,
            ],
            'success' => true
        ];
    }

    public function actionGetSiteSettings() {
        $model = new GeneralSettings();

        if (!$model)
            return [
                'error' => "No Model found",
                'response' => [],
                'success' => false
            ];

        return [
            'error' => "",
            'response' => [
                'title' => $model->title,
                'description' => $model->description,
                'email' => $model->email,
                'timezone' => $model->timezone,
                'dateformat' => $model->dateformat,
                'timeformat' => $model->timeformat,
                'headerlogo' => $model->headerlogo,
                'footerlogo' => $model->footerlogo,
                'footerdesc' => $model->footerdesc,
            ],
            'success' => true
        ];
    }

    private function searchInArray($needle, $key, $subject) {
        foreach ($subject as $k => $val) {
            if ($val[$key] === $needle) {
                return $k;
            }
        }
        return null;
    }

    public function actionGetHomePageContent() {
        die("sss");
        $model = new HomeSettings();
        if (!$model)
            return [
                'error' => "No Model Found",
                'response' => [],
                'success' => false
            ];

        return [
            'error' => "",
            'response' => [
                'banner_heading' => $model->banner_heading,
                'banner_description' => $model->banner_description,
                'banner_img' => $model->banner_img,
                'banner_page_link' => $model->banner_page_link,
                'content_text' => $model->content_text,
            ],
            'success' => true
        ];
    }

    // Hotel
    public function actionGetAllDestination($limit, $show_on_home = 0, $page = 0, $search_string = "") { 
		$with = [
            'destinationGalleries'
        ];

        $total_destinations = Destination::find()
                        ->joinWith('translations')
                        ->where(['not in', 'hotel_destination.id', [1, 8]]);
        if(!empty($search_string)){
            $total_destinations = $total_destinations->where(['like', 'hotel_destination_lang.title', $search_string]);
        }
        // get the total number of users
        $total_destinations_count = $total_destinations->count();
        //creating the pagination object
        $pagination = new Pagination(['totalCount' => $total_destinations_count, 'defaultPageSize' => $limit]);

        //try to display static page from datebase
        $destinations = Destination::getDb()->cache(function ($db) use($limit, $with, $show_on_home, $search_string, $pagination) {
            if ($limit == -1) {
                return Destination::findOne(1)
                        ->getDescendants()
                        ->joinWith('translations')
						// ->with($with)
                        ->where('hotel_destination.id NOT IN (:id1,:id2)', ['id1'=> 1, 'id2' => 8])
                        ->all();
            } else { 
                if(!empty($show_on_home)){
                    return Destination::findOne(1)
                        ->getDescendants()
                        ->joinWith('translations')
                        ->where('hotel_destination.id NOT IN (:id1,:id2) AND show_on_home = 1', ['id1'=> 1, 'id2' => 8])
                        ->limit($limit)
                        ->all();
                } else { 
                    $destinations = Destination::findOne(1)
                        ->getDescendants()
                        ->joinWith('translations')
                        ->where(['not in', 'hotel_destination.id', [1, 8]]);
                    if(!empty($search_string)){
                        $destinations = $destinations->where(['like', 'hotel_destination_lang.title', $search_string]);
                    }
                    //limit the query using the pagination and retrieve the destination
                    $destinations = $destinations->offset($pagination->offset)
                        ->limit($pagination->limit)
                        ->all();
                    return $destinations;
                }
            }
        }, 3600);

        $resultDestination = [];
        foreach ($destinations as $destination) {
            // ignore maldives
            // if($destination->slug == 'maldives') continue;
            $resultDestination[] = [
                'id' => $destination->id,
                'slug' => $destination->slug,
                'left_border' => $destination->left_border,
                'right_border' => $destination->right_border,
                'depth' => $destination->depth,
                'thumbnail' => $destination->thumbnail,
                'title' => $destination->title,
                'sub_description' => $destination->sub_description,
                // 'galleries' => $destination->destinationGalleries
            ];
        }

        if (!$resultDestination){
            return [
                'error' => "No destination Found",
                'response' => [],
                'total_destinations_count' => 0,
                'total_pages' => 0,
                'current_page' => -1,
                'success' => false
            ];
        }
        return [
            'error' => "",
            'response' => $resultDestination,
            'total_destinations_count' => $total_destinations_count,
            'total_pages' => $pagination->pageCount,
            'current_page' => $pagination->page,
            'success' => true
        ];
    }

    // Hotel
    public function actionGetTopResorts($limit) {
        //try to display static page from database
        $hotels = Hotel::getDb()->cache(function ($db) use($limit) {
            if ($limit == -1) {
                return Hotel::find(1)
                        ->joinWith('translations')
                        ->where('hotel.destination_id = :id AND hotel.show_on_home = 1', ['id' => 8])
                        ->all();
            } else {
                return Hotel::find(1)
                        ->joinWith('translations')
                        ->where('hotel.destination_id = :id AND hotel.show_on_home = 1', ['id' => 8])
                        ->limit($limit)
                        ->all();
            }
        }, 3600);

        $resultHotels = [];
        foreach ($hotels as $hotel) {
            $resultHotels[] = [
                'id' => $hotel->id,
                'slug' => $hotel->slug,
                'thumbnail' => $hotel->thumbnail,
                'logo' => $hotel->logo,
                'title' => $hotel->title,
                'recommended_for' => $hotel->recommended_for,
                'location' => $hotel->address,
                'starRating' => $hotel->star_rating,
                'distance' => $hotel->distance,
                'travel'  => $hotel->travel,
                'no_of_rooms' =>$hotel->no_of_rooms
            ];
        }

        if (!$resultHotels)
            return [
                'error' => "No hotel found",
                'response' => [],
                'success' => false
            ];

        return [
            'error' => "",
            'response' => $resultHotels,
            'success' => true
        ];
    }

    // Hotel
    public function actionGetTestimonials($limit = 5) {
        $testimonials = Testimonial::find()
                ->where('status=:status', [':status' => Testimonial::STATUS_PUBLISHED])
                ->limit($limit)
                ->orderBy(['id' => SORT_DESC])
                ->all();

        $resultTestimonial = [];
        foreach ($testimonials as $testimonial) {
            $resultTestimonial[] = [
                'id' => $testimonial->id,
                'client_name' => $testimonial->client_name,
                'destination' => $testimonial->destination,
                'avatar' => $testimonial->avatar,
                'remarks' => $testimonial->remarks
            ];
        }

        if (!$resultTestimonial)
            return [
                'error' => "No testimonials Found",
                'response' => [],
                'success' => false
            ];

        return [
            'error' => "",
            'response' => $resultTestimonial,
            'success' => true
        ];
    }

    public function actionAuthLogin() {
        $model = new LoginForm();

        $user = [];
        $model->username = Yii::$app->request->post("username");
        $model->password = Yii::$app->request->post("password");
        $model->rememberMe = Yii::$app->request->post("rememberMe");
        if ($model->username && $model->password) {
            if ($model->login()) {
                $user = [
                    'username' => $model->username,
                        /* 'name' => $model->first_name.' '. $model->last_name,
                          'avatar' => $model->avatar,
                          'email' => $model->email, */
                ];
                return [
                    'error' => "",
                    'response' => $user,
                    'success' => true
                ];
            }
        }
        return [
            'error' => $model->errors,
            'response' => [],
            'success' => false
        ];
    }

    public function actionGetPageContent($slug) {
        //try to display static page from datebase
        $pages = Page::getDb()->cache(function ($db) use ($slug) {
            return Page::findOne(['slug' => $slug, 'status' => Page::STATUS_PUBLISHED]);
        }, 3600);

        if (!$pages) {
            return [
                'error' => "No Page found!",
                'response' => [],
                'success' => false
            ];
        }

        return [
            'error' => "",
            'response' => [
                'title' => $pages->title,
                'content' => $pages->content,
                'banner_img' => $pages->banner,
            ],
            'success' => true
        ];
    }

    public function actionGetAllHotels($slug, $limit, $search = '', $filter_type = 0, $filter_value = 0, $page = 0) {
        //try to display static page from database
        $with = [
            'destinationGalleries'
        ];

        $total_hotels_query = Hotel::find()
                        ->joinWith('translations')
                        ->where(['hotel.destination_id' => 8])
                        ->andWhere(['hotel.status' => Hotel::STATUS_PUBLISHED]);
        if(!empty($search)){
            $total_hotels_query = $total_hotels_query->andWhere(['like', 'hotel_lang.title', $search]);
        }
        if(!empty($filter_type) && !empty($filter_value)){
        	if($filter_type == "star"){
        		$total_hotels_query = $total_hotels_query->andWhere(['=', 'hotel.star_rating', $filter_value]);	
        	} else if($filter_type == "rec"){
        		$total_hotels_query = $total_hotels_query->andWhere(['like', 'hotel.recommended_for', $filter_value]);		
        	}
        }
        // echo $total_hotels_query->createCommand()->getRawSql(); die();
        // get the total number of users
        $total_hotels_count = $total_hotels_query->count();
        //creating the pagination object
        $pagination = new Pagination(['totalCount' => $total_hotels_count, 'defaultPageSize' => $limit]);

        $destination = Destination::getDb()->cache(function ($db) use($slug) {
        	return Destination::find()->where('slug = "' . $slug . '"')->one();
        }, 3600);
        
        $resultDestination = [];
        if ($destination) {
            $resultDestination = [
                'title' => $destination->title,
                'description' => $destination->sub_description,
                'id' => $destination->id,
                'slug' => $destination->slug,
                'banner' => $destination->banner,
                'thumbnail' => $destination->thumbnail,
                'content' => $destination->description,
                'hotels' => [],
                'galleries' => $destination->getDestinationGalleries()->all(),
            ];
            $total_hotels_array = $total_hotels_query->offset($pagination->offset)
                        ->limit($pagination->limit)
                        ->all();
            foreach ($total_hotels_array as $hotel) {
                // if ($hotel->status != Hotel::STATUS_PUBLISHED || ($search != '' && strpos(strtolower($hotel->title),strtolower($search)) === false)) {
                //     continue;
                // }
                $resultDestination['hotels'][] = [
                    'id' => $hotel->id,
                    'slug' => $hotel->slug,
                    'thumbnail' => $hotel->thumbnail,
                    'logo' => $hotel->logo,
                    'title' => $hotel->title,
					'recommended_for' => $hotel->recommended_for,
                    //'description' => $hotel->content,
                    'location' => $hotel->address,
                    'starRating' => $hotel->star_rating,
                    'distance' => $hotel->distance,
                    'travel'  => $hotel->travel,
                    'no_of_rooms' =>$hotel->no_of_rooms
                ];
            }
        }

        if (!$resultDestination){
            return [
                'error' => "No hotel found",
                'response' => [],
                'total_hotels_count' => 0,
                'total_pages' => 0,
                'current_page' => -1,
                'success' => false
            ];
        }
        return [
            'error' => "",
            'response' => $resultDestination,
            'total_hotels_count' => $total_hotels_count,
            'total_pages' => $pagination->pageCount,
            'current_page' => $pagination->page,
            'success' => true
        ];
    }

    public function actionGetHotel($slug) {
        //try to display static page from datebase

        $with = [
            'hotelRooms',
            'hotelRooms.hotelRoomService',
            'hotelRooms.hotelRoomService.roomService',
            'hotelRooms.hotelRoomGalleries',
            'hotelServices',
            'hotelGalleries',
            'hotelServices.hotelService'
        ];
        $hotel = Hotel::getDb()->cache(function ($db) use($slug, $with) {
            return Hotel::find()->with($with)->where('slug = "' . $slug . '"')->one();
        }, 3600);
        //, 'status' => Hotel::STATUS_PUBLISHED]
        $resultHotel = [];
        if ($hotel) {
            $resultHotel = [
                'title' => $hotel->title,
                'id' => $hotel->id,
                'slug' => $hotel->slug,
                'banner' => $hotel->banner,
                'thumbnail' => $hotel->thumbnail,
                'logo' => $hotel->logo,
                'content' => $hotel->content,
                'price' => $hotel->price,
                'address' => $hotel->address,
                'starRating' => $hotel->star_rating,
                'distance' => $hotel->distance,
                'travel'  => $hotel->travel,
                'no_of_rooms' =>$hotel->no_of_rooms,
                'recommended_for' =>$hotel->recommended_for,
                'destinationId' => $hotel->destination->id,
                'destinationSlug' => $hotel->destination->slug,
                'destinationSubDescription' => $hotel->destination->sub_description,
                'destinationTitle' => $hotel->destination->title,
                'rooms' => [],
                'services' => [],
                'galleries' => [],
            ];
        }
        if ($hotel->hotelServices) {
            foreach ($hotel->hotelServices as $service) {
                $resultHotel['services'][$service->hotelService->service_type][] = [
                    'hotelServiceSlug' => $service->hotelService->slug,
                    'hotelServiceType' => $service->hotelService->service_type,
                    'hotelServiceTitle' => $service->hotelService->title,
                    'hotelServiceDescription' => $service->service_description,
                ];
            }
        }
        if ($hotel->hotelGalleries) {
            foreach ($hotel->hotelGalleries as $hotelGallery) {
                if ($hotelGallery->img == "") {
                    continue;
                }
                $resultHotel['galleries'][] = [
                    'hotelGalleryDescription' => $hotelGallery->description,
                    'hotelGalleryImg' => $hotelGallery->img,
                ];
            }
        }
        if ($hotel->hotelRooms) {
            foreach ($hotel->hotelRooms as $roomIndex => $room) {
                $resultHotel['rooms'][$roomIndex] = [
                    'id' => $room->id,
                    'slug' => $room->slug,
                    'content' => $room->content,
                    'thumbnail' => $room->thumbnail,
                    'title' => $room->title,
                    'services' => [],
                ];
                if ($room->hotelRoomService) {
                    foreach ($room->hotelRoomService as $service) {
                        $resultHotel['rooms'][$roomIndex]['services'][$service->roomService->service_type][] = [
                            'roomServiceSlug' => $service->roomService->slug,
                            'roomServiceType' => $service->roomService->service_type,
                            'roomServiceTitle' => $service->roomService->title,
                            'roomServiceDescription' => $service->service_description,
                        ];
                    }
                }
                if ($room->hotelRoomGalleries) {
                    foreach ($room->hotelRoomGalleries as $hotelRoomGallery) {
                        if ($hotelRoomGallery->img == "") {
                            continue;
                        }
                        $resultHotel['rooms'][$roomIndex]['galleries'][] = [
                            'roomGalleryDescription' => $hotelRoomGallery->description,
                            'roomGalleryImg' => $hotelRoomGallery->img,
                        ];
                    }
                }
            }
        }
        //echo "<pre>"; print_r($resultHotel);exit;
        if (!$resultHotel)
            return [
                'error' => "No hotel Found",
                'response' => [],
                'success' => false
            ];

        return [
            'error' => "",
            'response' => $resultHotel,
            'success' => true
        ];
    }

    public function actionSendQuote() {
        $request = Yii::$app->request;
        $params = $request->post();
        if(count($params) > 0){
            $noOfRooms = count($params['adults']);
            $arrival_date = str_pad($params['arrivalDate']['day'],2,'0',STR_PAD_LEFT).'/'.str_pad($params['arrivalDate']['month'],2,'0',STR_PAD_LEFT).'/'.$params['arrivalDate']['year'];
            $departure_date = str_pad($params['departureDate']['day'],2,'0',STR_PAD_LEFT).'/'.str_pad($params['departureDate']['month'],2,'0',STR_PAD_LEFT).'/'.$params['departureDate']['year'];
            $body = "A Quote form has been submitted with the following details for Hotel <b>{$params['hotel_name']}</b>: <br/>
                        Name: <b>{$params['name']}</b> <br/>
                        Phone: <b>{$params['contact_no']}</b> <br/>
                        Email: <b>{$params['email']}</b> <br/>
                        Nationality: <b>{$params['nationality']}</b> <br/>
                        Travel Dates: <b>{$arrival_date}</b> - <b>{$departure_date}</b><br/>
                        Any Special Request: <b>{$params['offerDetail']}</b> <br/>
                        No. Of Rooms: <b>{$noOfRooms}</b> <br/><hr/>
                    ";
            $model = new GeneralSettings();
            for($i=0;$i<$noOfRooms;$i++){
                $body .="Room ".($i+1).": <b>{$params['roomTitle'][$i]}</b><br/> 
                               Adults: {$params['adults'][$i]} <br/> 
                               Kids: {$params['kids'][$i]} <br/> 
                               Meal: {$params['meal'][$i]} <br/> <hr/>";
            }
            if(Yii::$app->mailer->compose()
                    ->setTo($model->email)
                    ->setFrom(['info@rawnaqsa.com' => 'Rawnaq Tourism'])
                    ->setBcc(['moni.7amody@gmail.com'])
                    ->setSubject("Hotel Quote Form")
                    ->setHtmlBody($body)
                    ->send()){
                return [
                    'success'=> true,
                    'message'=> 'Email has been sent'
                ];
            } else {
                return [
                    'success'=> false,
                    'message'=> 'Error in sending emails'
                ];
            }
        }
    }

    public function actionSendEnquiry() {
        $request = Yii::$app->request;
        $params = $request->post();
        if(count($params) > 0){
            $arrival_date = str_pad($params['arrivalDate']['day'],2,'0',STR_PAD_LEFT).'/'.str_pad($params['arrivalDate']['month'],2,'0',STR_PAD_LEFT).'/'.$params['arrivalDate']['year'];
            $departure_date = str_pad($params['departureDate']['day'],2,'0',STR_PAD_LEFT).'/'.str_pad($params['departureDate']['month'],2,'0',STR_PAD_LEFT).'/'.$params['departureDate']['year'];
            $body = "A Quote form has been submitted with the following details for Destination <b>{$params['destinationTitle']}</b>: <br/>
                        Name: <b>{$params['name']}</b> <br/>
                        Phone: <b>{$params['contact_no']}</b> <br/>
                        Email: <b>{$params['email']}</b> <br/>
                        No. of passengers: <b>{$params['totalPassengers']}</b> <br/>
                        Travel Dates: <b>{$arrival_date}</b> - <b>{$departure_date}</b><br/>
                        Any Other Details: <b>{$params['query']}</b> <br/><br/>
                    ";
            $model = new GeneralSettings();
            if(Yii::$app->mailer->compose()
                    ->setTo($model->email)
                    ->setBcc(['moni.7amody@gmail.com'])
                    ->setFrom(['info@rawnaqsa.com' => 'Rawnaq Tourism'])
                    ->setSubject("Destination Quote Form")
                    ->setHtmlBody($body)
                    ->send()){
                return [
                    'success'=> true,
                    'message'=> 'Email has been sent'
                ];
            } else {
                return [
                    'success'=> false,
                    'message'=> 'Error in sending emails'
                ];
            }
        }
    }

    public function actionSendContact() {
        $request = Yii::$app->request;
        $params = $request->post();
        if(count($params) > 0){
            $body = "A Quote form has been submitted with the following details: <br/>
                        Name: <b>{$params['clientName']}</b> <br/>
                        Phone: <b>{$params['clientContact']}</b> <br/>
                        Email: <b>{$params['clientEmail']}</b> <br/>
                        Subject: <b>{$params['clientSubject']}</b><br/>
                        Message: <b>{$params['clientContent']}</b> 
                    ";
            $model = new GeneralSettings();
            if(Yii::$app->mailer->compose()
                    ->setTo($model->email)
                    ->setBcc(['moni.7amody@gmail.com'])
                    ->setFrom(['info@rawnaqtourism.com' => 'Rawnaq Tourism'])
                    ->setSubject('Contact Form Submission')
                    ->setHtmlBody($body)
                    ->send()){
                return [
                    'success'=> true,
                    'message'=> 'Email has been sent'
                ];
            } else {
                return [
                    'success'=> false,
                    'message'=> 'Error in sending emails'
                ];
            }
        }
    }
}