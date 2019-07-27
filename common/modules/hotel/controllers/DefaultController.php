<?php

namespace common\modules\hotel\controllers;

use common\modules\hotel\models\HotelServices;
use Yii;
use yii\base\Model;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;
use common\modules\hotel\models\Hotel;
use common\modules\hotel\models\Service;
use common\modules\hotel\models\search\RoomSearch as RoomSearch;
use common\modules\hotel\models\HotelGalleries;
use yeesoft\controllers\admin\BaseController;
use yeesoft\models\User;

/**
 * HotelController implements the CRUD actions for Hotel model.
 */
class DefaultController extends BaseController
{

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
        $this->modelClass = $this->module->hotelModelClass;
        $this->modelSearchClass = $this->module->hotelModelSearchClass;

        $this->indexView = $this->module->indexView;
        $this->viewView = $this->module->viewView;
        $this->createView = $this->module->createView;
        $this->updateView = $this->module->updateView;

        parent::init();
    }

    protected function getRedirectPage($action, $model = null)
    {
        if (!User::hasPermission('editHotels') && $action == 'create') {
            return ['view', 'id' => $model->id];
        }

        switch ($action) {
            case 'update':
                return ['update', 'id' => $model->id];
                break;
            case 'create':
                return ['update', 'id' => $model->id];
                break;
            default:
                return parent::getRedirectPage($action, $model);
        }
    }

    public function actionCreate()
    {
        //self::import();
        $model = new Hotel;
        $modelsServices = [new HotelServices];
        $modelsGalleries = [new HotelGalleries];
        if ($model->load(Yii::$app->request->post())) {
            $modelsServices = HotelServices::createMultiple(HotelServices::classname());
            Model::loadMultiple($modelsServices, Yii::$app->request->post());
            
            $modelsGalleries = HotelGalleries::createMultiple(HotelGalleries::classname());
            Model::loadMultiple($modelsGalleries, Yii::$app->request->post());
            
            // ajax validation
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ArrayHelper::merge(
                    ActiveForm::validateMultiple($modelsServices),
                    ActiveForm::validateMultiple($modelsGalleries),
                    ActiveForm::validate($model)
                );
            }
            foreach ($modelsServices as $modelIndex=>$modelService) {
                $modelsServices[$modelIndex]->hotel_id = 1;
            }
            foreach ($modelsGalleries as $modelIndex=>$modelsGallery) {
                $modelsGalleries[$modelIndex]->hotel_id = 1;
            }
            
            // validate all models
            $valid = $model->validate();
            $valid = Model::validateMultiple($modelsServices) && $valid && Model::validateMultiple($modelsGalleries);

            if ($valid) {
                $transaction = \Yii::$app->db->beginTransaction();
                try {
                    if ($flag = $model->save(false)) {
                        foreach ($modelsServices as $modelService) {
                            $modelService->hotel_id = $model->id;
                            if (! ($flag = $modelService->save(false))) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                        
                        foreach ($modelsGalleries as $modelsGallery) {
                            $modelsGallery->hotel_id = $model->id;

                            if (($flag = $modelsGallery->save(false)) === false) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                    }
                    if ($flag) {
                        $transaction->commit();
                        Yii::$app->session->setFlash('crudMessage', Yii::t('yee', 'Your item has been created.'));
                        return $this->redirect($this->getRedirectPage('create', $model));
                    }
                }catch (Exception $e){
                    $transaction->rollBack();
                }
            }
        }

        return $this->render('create', [
            'model' => $model,
            'modelsServices' => (empty($modelsServices)) ? [new HotelServices] : $modelsServices,
            'modelsGalleries' => (empty($modelsGalleries)) ? [new HotelGalleries] : $modelsGalleries,
        ]);
        //return parent::actionCreate(); // TODO: Change the autogenerated stub
    }

    public function actionUpdate($id)
    {
        $model = $this->findModel($id);
        //$modelsServices = $model->getHotelServices($id);
        //$modelsServices  = Hotel::find()->with('hotelServices')->where(['id'=>$id])->all();
        $modelsServices = $model->hotelServices;
        $modelsGalleries = $model->hotelGalleries;
//echo "<pre>"; print_r($modelsServices);exit;
        if ($model->load(Yii::$app->request->post())) {
            $oldIDs = ArrayHelper::map($modelsServices, 'id', 'id');
            $modelsServices = HotelServices::createMultiple(HotelServices::classname(), $modelsServices);
            Model::loadMultiple($modelsServices, Yii::$app->request->post());
            foreach ($modelsServices as $modelIndex=>$modelService) {
                $modelsServices[$modelIndex]->hotel_id = $id;
            }
            $deletedIDs = array_diff($oldIDs, array_filter(ArrayHelper::map($modelsServices, 'id', 'id')));

            $modelsGalleries = HotelGalleries::createMultiple(HotelGalleries::classname(), $modelsGalleries);
            Model::loadMultiple($modelsGalleries, Yii::$app->request->post());
            foreach ($modelsGalleries as $modelIndex=>$modelService) {
                $modelsGalleries[$modelIndex]->hotel_id = $id;
            }
            $deletedIDGalls = array_diff($oldIDs, array_filter(ArrayHelper::map($modelsGalleries, 'id', 'id')));
            // ajax validation
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ArrayHelper::merge(
                    ActiveForm::validateMultiple($modelsServices),
                    ActiveForm::validate($model),
                    ActiveForm::validateMultiple($modelsGalleries)
                );
            }

            // validate all models
            $valid = $model->validate();
            $valid = Model::validateMultiple($modelsGalleries) && Model::validateMultiple($modelsServices) && $valid;

            if ($valid) {
                $transaction = \Yii::$app->db->beginTransaction();
                try {
                    if ($flag = $model->save(false)) {
                        //echo "<pre>"; print_r($modelsServices);exit;
                        if (! empty($deletedIDs)) {
                            HotelServices::deleteAll(['id' => $deletedIDs]);
                        }
                        foreach ($modelsServices as $modelService) {
                            $modelService->hotel_id = $model->id;
                            if (! ($flag = $modelService->save(false))) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                        
                        if (! empty($deletedIDGalls)) {
                            HotelGalleries::deleteAll(['id' => $deletedIDGalls]);
                        }
                        foreach ($modelsGalleries as $modelsGallery) {
                            $modelsGallery->hotel_id = $model->id;

                            if (($flag = $modelsGallery->save(false)) === false) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                    }
                    if ($flag) {
                        $transaction->commit();
                        Yii::$app->session->setFlash('crudMessage', Yii::t('yee', 'Your item has been updated.'));
                        return $this->redirect($this->getRedirectPage('update', $model));
                    }
                } catch (Exception $e) {
                    $transaction->rollBack();
                }
            }
        }
        
        $params = Yii::$app->request->getQueryParams();
        $params['hotel_id'] = $id;
        $dataProvider = $this->roomSearch($params);
        return $this->render('update', [
            'model' => $model,
            'modelsServices' => (empty($modelsServices)) ? [new HotelServices] : $modelsServices,
            'modelsGalleries' => (empty($modelsGalleries)) ? [new HotelGalleries] : $modelsGalleries,
            'dataProvider'=> $dataProvider[0],
            'searchModel'=> $dataProvider[1]
        ]);
       //return parent::actionUpdate($id); // TODO: Change the autogenerated stub
    }
    
    public function actionDelete($id)
    {
        /* @var $model \yeesoft\db\ActiveRecord */
        $model = $this->findModel($id);
        //echo "<pre>"; print_r($model->hotelRooms[0]->hotelRoomGalleries);exit;
        if($model){
            // delete lang
            foreach($model->translations as $translation){
                $translation->delete();
            }
            //delete service
            HotelServices::deleteAll(['hotel_id' => $id]);
            
            //delete room
            foreach($model->hotelRooms as $rooms){
                $hotelRoom = \common\modules\hotel\models\HotelRooms::findOne(['room_id' => $rooms->id]);
                $hotelRoom->delete();
                //lang
                foreach($rooms->translations as $translation){
                    $translation->delete();
                }
                //service
                foreach($rooms->hotelRoomService as $service){
                    $service->delete();
                }
                //galery
                foreach($rooms->hotelRoomGalleries as $gallery){
                    $gallery->delete();
                }
                $rooms->delete();
            }
            //\common\modules\hotel\models\HotelRooms::deleteAll(['hotel_id' => $id]);
            foreach($model->hotelGalleries as $gallery){
                    $gallery->delete();
                }
        }
        $model->delete();

        Yii::$app->session->setFlash('crudMessage', Yii::t('yee', 'Your item has been deleted.'));
        return $this->redirect($this->getRedirectPage('delete', $model));
    }

    private function roomSearch($params){
        $searchModel = new RoomSearch;
        
        $dataProvider = $searchModel->search($params);
        return [$dataProvider,$searchModel];
    }
    private static function import(){
        ini_set('max_execution_time', 3000);
        $handle = fopen('hotels_json.json', "r");
        $theData = fread($handle, filesize('hotels_json.json'));
        fclose($handle);
        $routes = array(
            'basePath' => '@frontend',
            'uploadPath' => 'uploads',
            'baseUrl'=>''
            );
        $rename = false;
        $thumbs = [
                'small' => [
                    'name' => 'Small size',
                    'size' => [120, 80],
                ],
                'medium' => [
                    'name' => 'Medium size',
                    'size' => [400, 300],
                ],
                'large' => [
                    'name' => 'Large size',
                    'size' => [800, 600],
                ],
            ];
        if($theData){
            $data = json_decode($theData, true);
            //echo "<pre>"; print_r($data);exit;
            foreach($data["hotels"] as $hotel){
                $logo = (isset($hotel['logo']))?str_replace('/', '-', $hotel['logo']):'';
                if($logo && file_exists('D:\rawnaq\backend\web\hotels\\'.str_replace('/', '\\', $hotel['logo']))){
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $_FILES = array(
                        'Media'=> array(
                            'name'=> array(
                                'file'=> $logo,
                            ),
                            'type'=> array(
                                'file'=> finfo_file($finfo, 'hotels/'.$hotel['logo']),
                            ),
                            'tmp_name' => array(
                                'file'=>'D:\rawnaq\backend\web\hotels\\'.str_replace('/', '\\', $hotel['logo'])
                            ),
                            'error'=>array(
                                'file'=>0
                            ),
                            'size'=>array(
                                'file'=>filesize('hotels/'.$hotel['logo'])
                            ),
                        )
                    );
                    //echo "<pre>"; print_r($routes);exit;
                    $modelHotelLogo = new \common\modules\media\models\Media();
                    try {
                        $modelHotelLogo->saveUploadedFile($routes, $rename);
                    } catch (\Exception $exc) {
                        echo "<pre>"; print_r( $exc->getMessage());
                    }
                    if ($modelHotelLogo->isImage()) {
                        $modelHotelLogo->createThumbs($routes, $thumbs);
                    }
                }
                \yii\web\UploadedFile::reset();
                $thumb = (isset($hotel['gallery'][0]['image']))?str_replace('/', '-',str_replace('./', '', $hotel['gallery'][0]['image'])):'';
                if($thumb && file_exists('D:\rawnaq\backend\web\hotels\\'.str_replace('/', '\\', $hotel['gallery'][0]['image']))){
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $_FILES = array(
                        'Media'=> array(
                            'name'=> array(
                                'file'=> $thumb,
                            ),
                            'type'=> array(
                                'file'=> finfo_file($finfo, 'hotels/'.$hotel['gallery'][0]['image']),
                            ),
                            'tmp_name' => array(
                                'file'=>'D:\rawnaq\backend\web\hotels\\'.str_replace('/', '\\', $hotel['gallery'][0]['image'])
                            ),
                            'error'=>array(
                                'file'=>0
                            ),
                            'size'=>array(
                                'file'=>filesize('hotels/'.$hotel['gallery'][0]['image'])
                            ),
                        )
                    );
                    $modelHotelThumb = new \common\modules\media\models\Media();
                    try {
                        $modelHotelThumb->saveUploadedFile($routes, $rename);
                    } catch (\Exception $exc) {
                        echo "<pre>"; print_r( $exc->getMessage());
                    }
                    if ($modelHotelThumb->isImage()) {
                        $modelHotelThumb->createThumbs($routes, $thumbs);
                    }
                }
                \yii\web\UploadedFile::reset();
                //hotel
                $modelHotel = new \common\modules\hotel\models\Hotel;
                $modelHotel->title = $hotel['name'];
                $content = '';
                foreach($hotel['descriptions'] as $desc){
                    if(isset($desc['heading'])){
                        $content.="<h2>{$desc['heading']}</h2>";
                    }
                    if(isset($desc['text'])){
                        $content.="<p>{$desc['text']}</p>";
                    }
                }
                $modelHotel->content = $content;
                $modelHotel->destination_id = 8;
                $modelHotel->status = 1;
                $modelHotel->comment_status = 0;
                $modelHotel->thumbnail = ($logo)?"/uploads/2018/08/$logo":'';
                $modelHotel->published_at = time();
                $modelHotel->created_at = time();
                $modelHotel->updated_at = time();
                $modelHotel->created_by = 1;
                $modelHotel->updated_by = 1;
                $modelHotel->revision = 0;
                $modelHotel->view = 'hotel';
                $modelHotel->layout = 'main';
                $modelHotel->banner = '/uploads/2018/07/maldives-banner.jpg';
                $modelHotel->logo = ($logo)?"/uploads/2018/08/$logo":'';
                $modelHotel->price = '100';
                $modelHotel->address = $hotel['location'].', Maldives Island';
                $modelHotel->save();

                if($hotel['rooms'] && isset($modelHotel->id) && $modelHotel->id != ""){
                    foreach ($hotel['rooms'] as $room){
                        $roomThumb = (isset($room['image']))?str_replace('/', '-',str_replace('./', 'room-', $room['image'])):'';
                        if($roomThumb && file_exists('D:\rawnaq\backend\web\hotels\\'.str_replace('/', '\\', str_replace('./', '', $room['image'])))){
                            $finfo = finfo_open(FILEINFO_MIME_TYPE);
                            $_FILES = array(
                                'Media'=> array(
                                    'name'=> array(
                                        'file'=> $roomThumb,
                                    ),
                                    'type'=> array(
                                        'file'=> finfo_file($finfo, 'hotels/'.str_replace('./', '', $room['image'])),
                                    ),
                                    'tmp_name' => array(
                                        'file'=>'D:\rawnaq\backend\web\hotels\\'.str_replace('/', '\\', str_replace('./', '', $room['image']))
                                    ),
                                    'error'=>array(
                                        'file'=>0
                                    ),
                                    'size'=>array(
                                        'file'=>filesize('hotels/'.str_replace('./', '', $room['image']))
                                    ),
                                )
                            );
                            //echo "<pre>"; print_r($routes);exit;
                            $modelRoomThumb = new \common\modules\media\models\Media();
                            try {
                                $modelRoomThumb->saveUploadedFile($routes, $rename);
                            } catch (\Exception $exc) {
                                echo "<pre>"; print_r( $exc->getMessage());
                            }
                            if ($modelRoomThumb->isImage()) {
                                $modelRoomThumb->createThumbs($routes, $thumbs);
                            }
                        }
                        \yii\web\UploadedFile::reset();
                        //room
                        $modelRoom = new \common\modules\hotel\models\Room;
                        $modelRoom->title = $room['name'];
                        $modelRoom->content = $room['description'];
                        $modelRoom->thumbnail = ($roomThumb)?"/uploads/2018/08/$roomThumb":'';
                        $modelRoom->created_at = time();
                        $modelRoom->updated_at = time();
                        $modelRoom->created_by = 1;
                        $modelRoom->updated_by = 1;
                        $modelRoom->save();
                        
                        if(isset($modelRoom->id) && $modelRoom->id != ""){
                            $modelHotelRoom = new \common\modules\hotel\models\HotelRooms;
                            $modelHotelRoom->hotel_id = $modelHotel->id;
                            $modelHotelRoom->room_id = $modelRoom->id;
                            $modelHotelRoom->save();
                            
                            //service
                            if(isset($room['facilities'])){
                                $services = explode(',', $room['facilities']);
                                $serviceID = 0;
                                if($services){
                                    foreach($services as $service){
                                        $record = Service::find()
                                                ->select(['hotel_service.*'])
                                                ->join('INNER JOIN','hotel_service_lang sh','hotel_service.id = sh.hotel_service_id')
                                                ->where(['lower(sh.title)'=> strtolower(trim($service))])
                                                ->one();
                                        if($record){
                                            $serviceID = $record->id;
                                        }else{
                                            $modelService = new Service();
                                            $modelService->title = trim($service);
                                            $modelService->service_type = 'FEATURES';
                                            $modelService->created_at = time();
                                            $modelService->updated_at = time();
                                            $modelService->created_by = 1;
                                            $modelService->updated_by = 1;
                                            $modelService->save();
                                            
                                            if($modelService->id){
                                                $serviceID = $modelService->id;
                                            }
                                        }
                                        if($serviceID){
                                            $modelRoomService = new \common\modules\hotel\models\HotelRoomServices();
                                            $modelRoomService->room_id = $modelRoom->id;
                                            $modelRoomService->service_id = $serviceID;
                                            $modelRoomService->save();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
