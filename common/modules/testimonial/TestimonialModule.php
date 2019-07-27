<?php
/**
 * @link http://www.yee-soft.com/
 * @copyright Copyright (c) 2015 Taras Makitra
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */

namespace common\modules\testimonial;

use Yii;

/**
 * Page Module For Yee CMS
 *
 * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class TestimonialModule extends \yii\base\Module
{
    /**
     * Version number of the module.
     */
    const VERSION = '0.1.0';

    public $controllerNamespace = 'common\modules\testimonial\controllers';
    public $viewList;
    public $layoutList;

    /**
     * Default views and layouts
     * Add more views and layouts in your main config file by calling the module
     *
     *   Example:
     *
     *   'page' => [
     *       'class' => 'yeesoft\page\PageModule',
     *       'viewList' => [
     *           'page' => 'View Label 1',
     *           'page_test' => 'View Label 2',
     *       ],
     *       'layoutList' => [
     *           'main' => 'Layout Label 1',
     *           'dark_layout' => 'Layout Label 2',
     *       ],
     *   ],
     */
    public $indexView = 'index';
    public $viewView = 'view';
    public $createView = 'create';
    public $updateView = 'update';
    public $testimonialModelClass = 'common\modules\testimonial\models\Testimonial';
    public $testimonialModelSearchClass = 'common\modules\testimonial\models\search\TestimonialSearch';
    public $thumbnailSize = 'small';
    public function init()
    {
        if (in_array($this->thumbnailSize, [])) {
            $this->thumbnailSize = 'medium';
        }
        parent::init();
    }
}