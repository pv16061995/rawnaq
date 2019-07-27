<?php


namespace common\modules\hotel;

use Yii;

/**
 * Hotel Module For CMS
 *
 * @author Muhammad Zakir <zakirmughal89@gmail.com>
 */
class HotelModule extends \yii\base\Module
{

    /**
     * Version number of the module.
     */
    const VERSION = '0.1.0';

    public $controllerNamespace = 'common\modules\hotel\controllers';
    public $viewList;
    public $layoutList;

    /**
     * Hotel model class
     *
     * @var string
     */
    public $hotelModelClass = 'common\modules\hotel\models\Hotel';

    /**
     * Hotel search model class
     *
     * @var string
     */
    public $hotelModelSearchClass = 'common\modules\hotel\models\search\HotelSearch';

    /**
     * Index page view
     *
     * @var string
     */
    public $indexView = 'index';

    /**
     * View page view
     *
     * @var string
     */
    public $viewView = 'view';

    /**
     * Create page view
     *
     * @var string
     */
    public $createView = 'create';

    /**
     * Update page view
     *
     * @var string
     */
    public $updateView = 'update';

    /**
     * Service model class
     *
     * @var string
     */
    public $serviceModelClass = 'common\modules\hotel\models\Service';

    /**
     * Service search model class
     *
     * @var string
     */
    public $serviceModelSearchClass = 'common\modules\hotel\models\search\ServiceSearch';

    /**
     * Index service view
     *
     * @var string
     */
    public $serviceIndexView = 'index';

    /**
     * View service view
     *
     * @var string
     */
    public $serviceViewView = 'view';

    /**
     * Create service view
     *
     * @var string
     */
    public $serviceCreateView = 'create';

    /**
     * Update service view
     *
     * @var string
     */
    public $serviceUpdateView = 'update';

    /**
     * Destination model class
     *
     * @var string
     */
    public $destinationModelClass = 'common\modules\hotel\models\Destination';

    /**
     * Destination search model class
     *
     * @var string
     */
    public $destinationModelSearchClass = 'common\modules\hotel\models\search\DestinationSearch';

    /**
     * Index destination view
     *
     * @var string
     */
    public $destinationIndexView = 'index';

    /**
     * View Destination view
     *
     * @var string
     */
    public $destinationViewView = 'view';

    /**
     * Create destination view
     *
     * @var string
     */
    public $destinationCreateView = 'create';

    /**
     * Update destination view
     *
     * @var string
     */
    public $destinationUpdateView = 'update';

    /**
     * Room model class
     *
     * @var string
     */
    public $roomModelClass = 'common\modules\hotel\models\Room';

    /**
     * Room search model class
     *
     * @var string
     */
    public $roomModelSearchClass = 'common\modules\hotel\models\search\RoomSearch';

    /**
     * Index room view
     *
     * @var string
     */
    public $roomIndexView = 'index';

    /**
     * View Destination view
     *
     * @var string
     */
    public $roomViewView = 'view';

    /**
     * Create destination view
     *
     * @var string
     */
    public $roomCreateView = 'create';

    /**
     * Update destination view
     *
     * @var string
     */
    public $roomUpdateView = 'update';


    /**
     * Size of thumbnail image of the post.
     *
     * Expected values: 'original' or sizes from yeesoft\media\MediaModule::$thumbs,
     * by default there are: 'small', 'medium', 'large'
     *
     * @var string
     */
    public $thumbnailSize = 'original';

    /**
     * Default views and layouts
     * Add more views and layouts in your main config file by calling the module
     *
     *   Example:
     *
     *   'post' => [
     *       'class' => 'yeesoft\post\PostModule',
     *       'viewList' => [
     *           'post' => 'View Label 1',
     *           'post_test' => 'View Label 2',
     *       ],
     *       'layoutList' => [
     *           'main' => 'Layout Label 1',
     *           'dark_layout' => 'Layout Label 2',
     *       ],
     *   ],
     */
    public function init()
    {
        if (in_array($this->thumbnailSize, [])) {
            $this->thumbnailSize = 'original';
        }

        if (empty($this->viewList)) {
            $this->viewList = [
                'hotel' => Yii::t('yee', 'Hotel view')
            ];
        }

        if (empty($this->layoutList)) {
            $this->layoutList = [
                'main' => Yii::t('yee', 'Main layout')
            ];
        }

        parent::init();
    }

}
