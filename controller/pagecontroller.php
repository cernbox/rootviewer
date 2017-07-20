<?php
/*
 * ownCloud - rootviewer
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Hugo Gonzalez Labrador (CERN) <hugo.gonzalez.labrador@cern.ch>
 * @copyright Hugo Gonzalez Labrador (CERN) 2017
 */

namespace OCA\RootViewer\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

class PageController extends Controller {


	private $userId;
	private $eosUtil;

	public function __construct($AppName, IRequest $request, $UserId){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->eosUtil = \OC::$server->getCernBoxEosUtil();
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function doLoad($filename) {
		if(!$this->userId) {
			return new DataResponse(['error' => 'user is not logged in']);
		}

		list($uid, $gid) = $this->eosUtil->getUidAndGidForUsername($this->userId);
		if(!$uid || !$gid) {
			return new DataResponse(['error' => 'user does not have valid uid/gid']);
		}

		$node = \OC::$server->getUserFolder($this->userId)->get($filename);
		if(!$node) {
			return new DataResponse(['error' => 'file does not exists']);
		}

		$info = $node->stat();
		// TODO(labkode): check for file size limit maybe?

		$content = $node->getContent();
		echo $content;
	}

	/**
	 * @PublicPage
	 * @NoCSRFRequired
	 */
	public function doPublicLoad($token, $filename) {
		$share = \OC::$server->getShareManager()->getShareByToken($token);
		if(!$share) {
			return new DataResponse(['error' => 'invalid token']);
		}
		$owner = $share->getShareOwner();
		list($uid, $gid) = $this->eosUtil->getUidAndGidForUsername($owner);
		if(!$uid || !$gid) {
			return new DataResponse(['error' => 'user does not have valid uid/gid']);
		}

		$node = $share->getNode();
		if($node->getType() === \OCP\Files\FileInfo::TYPE_FOLDER) {
			$node = $share->getNode()->get($filename);
		}
		if(!$node) {
			return new DataResponse(['error' => 'file does not exists']);
		}

		$info = $node->stat();
		// TODO(labkode): check for file size limit maybe?

		$content = $node->getContent();
		echo $content;
	}
}