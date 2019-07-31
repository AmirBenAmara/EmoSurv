/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4a42526856490d43be71"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\nmodule.exports = function(updatedModules, renewedModules) {\r\n\tvar unacceptedModules = updatedModules.filter(function(moduleId) {\r\n\t\treturn renewedModules && renewedModules.indexOf(moduleId) < 0;\r\n\t});\r\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\r\n\r\n\tif (unacceptedModules.length > 0) {\r\n\t\tlog(\r\n\t\t\t\"warning\",\r\n\t\t\t\"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\"\r\n\t\t);\r\n\t\tunacceptedModules.forEach(function(moduleId) {\r\n\t\t\tlog(\"warning\", \"[HMR]  - \" + moduleId);\r\n\t\t});\r\n\t}\r\n\r\n\tif (!renewedModules || renewedModules.length === 0) {\r\n\t\tlog(\"info\", \"[HMR] Nothing hot updated.\");\r\n\t} else {\r\n\t\tlog(\"info\", \"[HMR] Updated modules:\");\r\n\t\trenewedModules.forEach(function(moduleId) {\r\n\t\t\tif (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\r\n\t\t\t\tvar parts = moduleId.split(\"!\");\r\n\t\t\t\tlog.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\r\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\r\n\t\t\t\tlog.groupEnd(\"info\");\r\n\t\t\t} else {\r\n\t\t\t\tlog(\"info\", \"[HMR]  - \" + moduleId);\r\n\t\t\t}\r\n\t\t});\r\n\t\tvar numberIds = renewedModules.every(function(moduleId) {\r\n\t\t\treturn typeof moduleId === \"number\";\r\n\t\t});\r\n\t\tif (numberIds)\r\n\t\t\tlog(\r\n\t\t\t\t\"info\",\r\n\t\t\t\t\"[HMR] Consider using the NamedModulesPlugin for module names.\"\r\n\t\t\t);\r\n\t}\r\n};\r\n\n\n//# sourceURL=webpack:///(webpack)/hot/log-apply-result.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\r\n\r\nfunction dummy() {}\r\n\r\nfunction shouldLog(level) {\r\n\tvar shouldLog =\r\n\t\t(logLevel === \"info\" && level === \"info\") ||\r\n\t\t([\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\") ||\r\n\t\t([\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\");\r\n\treturn shouldLog;\r\n}\r\n\r\nfunction logGroup(logFn) {\r\n\treturn function(level, msg) {\r\n\t\tif (shouldLog(level)) {\r\n\t\t\tlogFn(msg);\r\n\t\t}\r\n\t};\r\n}\r\n\r\nmodule.exports = function(level, msg) {\r\n\tif (shouldLog(level)) {\r\n\t\tif (level === \"info\") {\r\n\t\t\tconsole.log(msg);\r\n\t\t} else if (level === \"warning\") {\r\n\t\t\tconsole.warn(msg);\r\n\t\t} else if (level === \"error\") {\r\n\t\t\tconsole.error(msg);\r\n\t\t}\r\n\t}\r\n};\r\n\r\nvar group = console.group || dummy;\r\nvar groupCollapsed = console.groupCollapsed || dummy;\r\nvar groupEnd = console.groupEnd || dummy;\r\n\r\nmodule.exports.group = logGroup(group);\r\n\r\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\r\n\r\nmodule.exports.groupEnd = logGroup(groupEnd);\r\n\r\nmodule.exports.setLogLevel = function(level) {\r\n\tlogLevel = level;\r\n};\r\n\n\n//# sourceURL=webpack:///(webpack)/hot/log.js?");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\r\n\tMIT License http://www.opensource.org/licenses/mit-license.php\r\n\tAuthor Tobias Koppers @sokra\r\n*/\r\n/*globals __resourceQuery */\r\nif (true) {\r\n\tvar hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\r\n\tvar log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\r\n\r\n\tvar checkForUpdate = function checkForUpdate(fromUpdate) {\r\n\t\tif (module.hot.status() === \"idle\") {\r\n\t\t\tmodule.hot\r\n\t\t\t\t.check(true)\r\n\t\t\t\t.then(function(updatedModules) {\r\n\t\t\t\t\tif (!updatedModules) {\r\n\t\t\t\t\t\tif (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\r\n\t\t\t\t\t\treturn;\r\n\t\t\t\t\t}\r\n\t\t\t\t\t__webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\r\n\t\t\t\t\tcheckForUpdate(true);\r\n\t\t\t\t})\r\n\t\t\t\t.catch(function(err) {\r\n\t\t\t\t\tvar status = module.hot.status();\r\n\t\t\t\t\tif ([\"abort\", \"fail\"].indexOf(status) >= 0) {\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Cannot apply update.\");\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] \" + err.stack || err.message);\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] You need to restart the application!\");\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tlog(\"warning\", \"[HMR] Update failed: \" + err.stack || err.message);\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t}\r\n\t};\r\n\tsetInterval(checkForUpdate, hotPollInterval);\r\n} else {}\r\n\n/* WEBPACK VAR INJECTION */}.call(this, \"?1000\"))\n\n//# sourceURL=webpack:///(webpack)/hot/poll.js?");

/***/ }),

/***/ "./src/app.controller.ts":
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst app_service_1 = __webpack_require__(/*! ./app.service */ \"./src/app.service.ts\");\r\nlet AppController = class AppController {\r\n    constructor(appService) {\r\n        this.appService = appService;\r\n    }\r\n};\r\nAppController = __decorate([\r\n    common_1.Controller(),\r\n    __metadata(\"design:paramtypes\", [app_service_1.AppService])\r\n], AppController);\r\nexports.AppController = AppController;\r\n\n\n//# sourceURL=webpack:///./src/app.controller.ts?");

/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst app_controller_1 = __webpack_require__(/*! ./app.controller */ \"./src/app.controller.ts\");\r\nconst app_service_1 = __webpack_require__(/*! ./app.service */ \"./src/app.service.ts\");\r\nconst api_module_1 = __webpack_require__(/*! ./modules/api/api.module */ \"./src/modules/api/api.module.ts\");\r\nconst static_module_1 = __webpack_require__(/*! ./modules/static/static.module */ \"./src/modules/static/static.module.ts\");\r\nconst events_gateway_1 = __webpack_require__(/*! ./events.gateway. */ \"./src/events.gateway..ts\");\r\nlet AppModule = class AppModule {\r\n};\r\nAppModule = __decorate([\r\n    common_1.Module({\r\n        imports: [api_module_1.ApiModule, static_module_1.StaticModule],\r\n        controllers: [app_controller_1.AppController],\r\n        providers: [app_service_1.AppService, events_gateway_1.EventsGateway],\r\n    })\r\n], AppModule);\r\nexports.AppModule = AppModule;\r\n\n\n//# sourceURL=webpack:///./src/app.module.ts?");

/***/ }),

/***/ "./src/app.service.ts":
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nlet AppService = class AppService {\r\n};\r\nAppService = __decorate([\r\n    common_1.Injectable()\r\n], AppService);\r\nexports.AppService = AppService;\r\n\n\n//# sourceURL=webpack:///./src/app.service.ts?");

/***/ }),

/***/ "./src/events.gateway..ts":
/*!********************************!*\
  !*** ./src/events.gateway..ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst websockets_1 = __webpack_require__(/*! @nestjs/websockets */ \"@nestjs/websockets\");\r\nlet EventsGateway = class EventsGateway {\r\n    afterInit(server) {\r\n        return undefined;\r\n    }\r\n    handleConnection(client) {\r\n        return undefined;\r\n    }\r\n    onEvent(client, data) {\r\n        const event = 'events';\r\n        const response = {\r\n            ping: data,\r\n            pongg: new Date()\r\n        };\r\n        console.log('[SOCKET-IO] events triggered');\r\n        return { event, data: response };\r\n    }\r\n};\r\n__decorate([\r\n    websockets_1.SubscribeMessage('events'),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Object)\r\n], EventsGateway.prototype, \"onEvent\", null);\r\nEventsGateway = __decorate([\r\n    websockets_1.WebSocketGateway()\r\n], EventsGateway);\r\nexports.EventsGateway = EventsGateway;\r\n\n\n//# sourceURL=webpack:///./src/events.gateway..ts?");

/***/ }),

/***/ "./src/main.hmr.ts":
/*!*************************!*\
  !*** ./src/main.hmr.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst core_1 = __webpack_require__(/*! @nestjs/core */ \"@nestjs/core\");\r\nconst app_module_1 = __webpack_require__(/*! ./app.module */ \"./src/app.module.ts\");\r\nconst fs = __webpack_require__(/*! fs-extra */ \"fs-extra\");\r\nconst dotenv = __webpack_require__(/*! dotenv */ \"dotenv\");\r\ndotenv.config();\r\nfunction bootstrap() {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        const httpsOptions = {\r\n            key: fs.readFileSync('/etc/letsencrypt/live/fivepplatform.westeurope.cloudapp.azure.com/privkey.pem'),\r\n            cert: fs.readFileSync('/etc/letsencrypt/live/fivepplatform.westeurope.cloudapp.azure.com/fullchain.pem'),\r\n        };\r\n        const app = yield core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions });\r\n        app.enableCors();\r\n        yield app.listen(3000);\r\n        if (true) {\r\n            module.hot.accept();\r\n            module.hot.dispose(() => app.close());\r\n        }\r\n    });\r\n}\r\nbootstrap();\r\n\n\n//# sourceURL=webpack:///./src/main.hmr.ts?");

/***/ }),

/***/ "./src/modules/api/api.module.ts":
/*!***************************************!*\
  !*** ./src/modules/api/api.module.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst users_module_1 = __webpack_require__(/*! ./users/users.module */ \"./src/modules/api/users/users.module.ts\");\r\nconst pools_module_1 = __webpack_require__(/*! ./pools/pools.module */ \"./src/modules/api/pools/pools.module.ts\");\r\nconst profiles_module_1 = __webpack_require__(/*! ./profiles/profiles.module */ \"./src/modules/api/profiles/profiles.module.ts\");\r\nconst upload_module_1 = __webpack_require__(/*! ./upload/upload.module */ \"./src/modules/api/upload/upload.module.ts\");\r\nconst evaluation_module_1 = __webpack_require__(/*! ./evaluation/evaluation.module */ \"./src/modules/api/evaluation/evaluation.module.ts\");\r\nconst mailing_module_1 = __webpack_require__(/*! ./mailing/mailing.module */ \"./src/modules/api/mailing/mailing.module.ts\");\r\nlet ApiModule = class ApiModule {\r\n};\r\nApiModule = __decorate([\r\n    common_1.Module({\r\n        imports: [mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/nestdb'), users_module_1.UsersModule, pools_module_1.PoolsModule, profiles_module_1.ProfilesModule, upload_module_1.UploadModule, evaluation_module_1.EvaluationModule, mailing_module_1.MailingModule],\r\n        controllers: [],\r\n        providers: [],\r\n    })\r\n], ApiModule);\r\nexports.ApiModule = ApiModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/api.module.ts?");

/***/ }),

/***/ "./src/modules/api/common/interceptors/logging.interceptor.ts":
/*!********************************************************************!*\
  !*** ./src/modules/api/common/interceptors/logging.interceptor.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst operators_1 = __webpack_require__(/*! rxjs/operators */ \"rxjs/operators\");\r\nlet LoggingInterceptor = class LoggingInterceptor {\r\n    intercept(context, call$) {\r\n        const now = Date.now();\r\n        return call$.pipe(operators_1.tap(() => { console.log(`${context.getArgs()[0].method} - ${context.getArgs()[0].originalUrl} ${Date.now() - now}ms`); }));\r\n    }\r\n};\r\nLoggingInterceptor = __decorate([\r\n    common_1.Injectable()\r\n], LoggingInterceptor);\r\nexports.LoggingInterceptor = LoggingInterceptor;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/common/interceptors/logging.interceptor.ts?");

/***/ }),

/***/ "./src/modules/api/common/interceptors/transform.interceptor.ts":
/*!**********************************************************************!*\
  !*** ./src/modules/api/common/interceptors/transform.interceptor.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst operators_1 = __webpack_require__(/*! rxjs/operators */ \"rxjs/operators\");\r\nlet TransformInterceptor = class TransformInterceptor {\r\n    intercept(context, call$) {\r\n        return call$.pipe(operators_1.map(data => ({ data })));\r\n    }\r\n};\r\nTransformInterceptor = __decorate([\r\n    common_1.Injectable()\r\n], TransformInterceptor);\r\nexports.TransformInterceptor = TransformInterceptor;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/common/interceptors/transform.interceptor.ts?");

/***/ }),

/***/ "./src/modules/api/common/passport/auth.guard.ts":
/*!*******************************************************!*\
  !*** ./src/modules/api/common/passport/auth.guard.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst passport = __webpack_require__(/*! passport */ \"passport\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst defaultOptions = {\r\n    session: false,\r\n    property: 'user',\r\n};\r\nfunction AuthGuard(type, role = [''], options = defaultOptions) {\r\n    options = Object.assign({}, defaultOptions, options);\r\n    const guard = common_1.mixin(class {\r\n        constructor(reflector) {\r\n            this.reflector = reflector;\r\n        }\r\n        canActivate(context) {\r\n            return __awaiter(this, void 0, void 0, function* () {\r\n                const httpContext = context.switchToHttp();\r\n                const [request, response] = [\r\n                    httpContext.getRequest(),\r\n                    httpContext.getResponse(),\r\n                ];\r\n                request[options.property || defaultOptions.property] = yield new Promise((resolve, reject) => passport.authenticate(type, options, (err, user, info) => {\r\n                    if (role[0] !== '') {\r\n                        if (role.indexOf(user.role)) {\r\n                            return reject(err || new common_1.UnauthorizedException());\r\n                        }\r\n                    }\r\n                    if (err || !user) {\r\n                        return reject(err || new common_1.UnauthorizedException());\r\n                    }\r\n                    resolve(user);\r\n                })(request, response, resolve));\r\n                return true;\r\n            });\r\n        }\r\n    });\r\n    return guard;\r\n}\r\nexports.AuthGuard = AuthGuard;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/common/passport/auth.guard.ts?");

/***/ }),

/***/ "./src/modules/api/common/passport/passport.strategy.ts":
/*!**************************************************************!*\
  !*** ./src/modules/api/common/passport/passport.strategy.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst passport = __webpack_require__(/*! passport */ \"passport\");\r\nclass AbstractStrategy {\r\n}\r\nexports.AbstractStrategy = AbstractStrategy;\r\nfunction PassportStrategy(Strategy) {\r\n    class MixinStrategy extends Strategy {\r\n        constructor(...args) {\r\n            super(...args, (...params) => this.validate(...params));\r\n            passport.use(this);\r\n        }\r\n    }\r\n    return MixinStrategy;\r\n}\r\nexports.PassportStrategy = PassportStrategy;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/common/passport/passport.strategy.ts?");

/***/ }),

/***/ "./src/modules/api/common/strategy/jwt.strategy.ts":
/*!*********************************************************!*\
  !*** ./src/modules/api/common/strategy/jwt.strategy.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst passport_jwt_1 = __webpack_require__(/*! passport-jwt */ \"passport-jwt\");\r\nconst user_service_1 = __webpack_require__(/*! ../../users/user.service */ \"./src/modules/api/users/user.service.ts\");\r\nconst passport_strategy_1 = __webpack_require__(/*! ../passport/passport.strategy */ \"./src/modules/api/common/passport/passport.strategy.ts\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nlet JwtStrategy = class JwtStrategy extends passport_strategy_1.PassportStrategy(passport_jwt_1.Strategy) {\r\n    constructor(usersService) {\r\n        super({\r\n            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),\r\n            secretOrKey: 'secretKey',\r\n        });\r\n        this.usersService = usersService;\r\n    }\r\n    validate(payload, done) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const user = yield this.usersService.validateUser(payload);\r\n            if (!user) {\r\n                return done(new common_1.UnauthorizedException(), false);\r\n            }\r\n            done(null, user);\r\n        });\r\n    }\r\n};\r\nJwtStrategy = __decorate([\r\n    common_1.Injectable(),\r\n    __metadata(\"design:paramtypes\", [user_service_1.UsersService])\r\n], JwtStrategy);\r\nexports.JwtStrategy = JwtStrategy;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/common/strategy/jwt.strategy.ts?");

/***/ }),

/***/ "./src/modules/api/evaluation/evaluation.controller.ts":
/*!*************************************************************!*\
  !*** ./src/modules/api/evaluation/evaluation.controller.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst evaluation_service_1 = __webpack_require__(/*! ./evaluation.service */ \"./src/modules/api/evaluation/evaluation.service.ts\");\r\nconst logging_interceptor_1 = __webpack_require__(/*! ../common/interceptors/logging.interceptor */ \"./src/modules/api/common/interceptors/logging.interceptor.ts\");\r\nconst transform_interceptor_1 = __webpack_require__(/*! ../common/interceptors/transform.interceptor */ \"./src/modules/api/common/interceptors/transform.interceptor.ts\");\r\nlet EvaluationController = class EvaluationController {\r\n    constructor(evaluationService) {\r\n        this.evaluationService = evaluationService;\r\n    }\r\n    createEvaluation(evaluation) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.createEvaluation(evaluation);\r\n        });\r\n    }\r\n    createTest(test) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.evaluationService.createTest(test);\r\n        });\r\n    }\r\n    updateTest(test, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.updateTest(id, test);\r\n        });\r\n    }\r\n    findAllEvaluations() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.findAllEvaluations();\r\n        });\r\n    }\r\n    findAllTests() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.findAllTests();\r\n        });\r\n    }\r\n    findOneEvaluationsByCode(code) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.findOneByCode(code);\r\n        });\r\n    }\r\n    findOneEvaluationsByCodeToStart(code) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.findOneByCodeToStart(code);\r\n        });\r\n    }\r\n    findOneByCodeToSubmit(code, body) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.findOneByCodeToSubmit(code, body);\r\n        });\r\n    }\r\n    findOneByCodeToSubmitQuiz(code, body) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.evaluationService.findOneByCodeToSubmitQuiz(code, body);\r\n        });\r\n    }\r\n    run(code) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.evaluationService.runCode(code);\r\n        });\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Post(),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Array]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"createEvaluation\", null);\r\n__decorate([\r\n    common_1.Post('test'),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"createTest\", null);\r\n__decorate([\r\n    common_1.Put('test/:id'),\r\n    __param(0, common_1.Body()), __param(1, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"updateTest\", null);\r\n__decorate([\r\n    common_1.Get(),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"findAllEvaluations\", null);\r\n__decorate([\r\n    common_1.Get('test'),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"findAllTests\", null);\r\n__decorate([\r\n    common_1.Get('pass/:code'),\r\n    __param(0, common_1.Param('code')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"findOneEvaluationsByCode\", null);\r\n__decorate([\r\n    common_1.Get('start/:code'),\r\n    __param(0, common_1.Param('code')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"findOneEvaluationsByCodeToStart\", null);\r\n__decorate([\r\n    common_1.Post('submit/:code'),\r\n    __param(0, common_1.Param('code')), __param(1, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"findOneByCodeToSubmit\", null);\r\n__decorate([\r\n    common_1.Post('quiz/:code'),\r\n    __param(0, common_1.Param('code')), __param(1, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"findOneByCodeToSubmitQuiz\", null);\r\n__decorate([\r\n    common_1.Post('run'),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], EvaluationController.prototype, \"run\", null);\r\nEvaluationController = __decorate([\r\n    common_1.Controller('api/evaluation'),\r\n    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),\r\n    __metadata(\"design:paramtypes\", [evaluation_service_1.EvaluationService])\r\n], EvaluationController);\r\nexports.EvaluationController = EvaluationController;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/evaluation/evaluation.controller.ts?");

/***/ }),

/***/ "./src/modules/api/evaluation/evaluation.module.ts":
/*!*********************************************************!*\
  !*** ./src/modules/api/evaluation/evaluation.module.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst evaluation_controller_1 = __webpack_require__(/*! ./evaluation.controller */ \"./src/modules/api/evaluation/evaluation.controller.ts\");\r\nconst evaluation_service_1 = __webpack_require__(/*! ./evaluation.service */ \"./src/modules/api/evaluation/evaluation.service.ts\");\r\nconst evaluation_schema_1 = __webpack_require__(/*! ./schemas/evaluation.schema */ \"./src/modules/api/evaluation/schemas/evaluation.schema.ts\");\r\nconst test_schema_1 = __webpack_require__(/*! ./schemas/test.schema */ \"./src/modules/api/evaluation/schemas/test.schema.ts\");\r\nconst profile_schema_1 = __webpack_require__(/*! ../profiles/schemas/profile.schema */ \"./src/modules/api/profiles/schemas/profile.schema.ts\");\r\nconst pool_schema_1 = __webpack_require__(/*! ../pools/schemas/pool.schema */ \"./src/modules/api/pools/schemas/pool.schema.ts\");\r\nlet EvaluationModule = class EvaluationModule {\r\n};\r\nEvaluationModule = __decorate([\r\n    common_1.Module({\r\n        imports: [\r\n            mongoose_1.MongooseModule.forFeature([{ name: 'Evaluation', schema: evaluation_schema_1.EvaluationSchema }]),\r\n            mongoose_1.MongooseModule.forFeature([{ name: 'Test', schema: test_schema_1.TestSchema }]),\r\n            mongoose_1.MongooseModule.forFeature([{ name: 'Profile', schema: profile_schema_1.ProfileSchema }]),\r\n            mongoose_1.MongooseModule.forFeature([{ name: 'Pool', schema: pool_schema_1.PoolSchema }]),\r\n        ],\r\n        controllers: [evaluation_controller_1.EvaluationController],\r\n        providers: [evaluation_service_1.EvaluationService],\r\n    })\r\n], EvaluationModule);\r\nexports.EvaluationModule = EvaluationModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/evaluation/evaluation.module.ts?");

/***/ }),

/***/ "./src/modules/api/evaluation/evaluation.service.ts":
/*!**********************************************************!*\
  !*** ./src/modules/api/evaluation/evaluation.service.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst evaluation_schema_1 = __webpack_require__(/*! ./schemas/evaluation.schema */ \"./src/modules/api/evaluation/schemas/evaluation.schema.ts\");\r\nconst childP = __webpack_require__(/*! child_process */ \"child_process\");\r\nconst path = __webpack_require__(/*! path */ \"path\");\r\nconst fs = __webpack_require__(/*! fs-extra */ \"fs-extra\");\r\nconst uuid_1 = __webpack_require__(/*! uuid */ \"uuid\");\r\nconst test_schema_1 = __webpack_require__(/*! ./schemas/test.schema */ \"./src/modules/api/evaluation/schemas/test.schema.ts\");\r\nconst nodemailer = __webpack_require__(/*! nodemailer */ \"nodemailer\");\r\nconst smtpPool = __webpack_require__(/*! nodemailer-smtp-pool */ \"nodemailer-smtp-pool\");\r\nconst profile_schema_1 = __webpack_require__(/*! ../profiles/schemas/profile.schema */ \"./src/modules/api/profiles/schemas/profile.schema.ts\");\r\nconst pool_schema_1 = __webpack_require__(/*! ../pools/schemas/pool.schema */ \"./src/modules/api/pools/schemas/pool.schema.ts\");\r\nconst htmlContent_1 = __webpack_require__(/*! ./htmlContent */ \"./src/modules/api/evaluation/htmlContent.ts\");\r\nlet EvaluationService = class EvaluationService {\r\n    constructor(evaluationModel, testModel, profileModel, poolModel) {\r\n        this.evaluationModel = evaluationModel;\r\n        this.testModel = testModel;\r\n        this.profileModel = profileModel;\r\n        this.poolModel = poolModel;\r\n    }\r\n    createEvaluation(evaluations) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            if (!Array.isArray(evaluations)) {\r\n                return { message: 'missing params' };\r\n            }\r\n            let poolObj = null;\r\n            if (evaluations[0].pool) {\r\n                poolObj = this.poolModel.create(evaluations[0].pool).then();\r\n            }\r\n            const NewProfiles = evaluations.filter(ev => ev.profile['_id'] === undefined);\r\n            const messages = [];\r\n            for (let i = 0; i < evaluations.length; i++) {\r\n                if (NewProfiles.filter(pr => pr.profile['email'] === evaluations[i].profile['email']).length !== 0) {\r\n                    evaluations[i]['profile'] = yield this.profileModel.create(evaluations[i].profile);\r\n                }\r\n                evaluations[i]['status'] = 'not started';\r\n                evaluations[i]['uuid'] = uuid_1.v4();\r\n                evaluations[i]['createdDate'] = Number.parseInt(Date.now().toString());\r\n                if (poolObj !== null) {\r\n                    evaluations[i].pool = poolObj['_id'];\r\n                }\r\n                evaluations[i]['startedDate'] = null;\r\n                evaluations[i] = yield this.evaluationModel.create(evaluations[i]);\r\n                if (evaluations[i].profile['email'] === undefined) {\r\n                    evaluations[i].profile = yield this.profileModel.findById(evaluations[i].profile).exec();\r\n                }\r\n                evaluations[i]['test'] = yield this.testModel.findById(evaluations[i]['test']).exec();\r\n                const message = {\r\n                    from: 'FivePoints <contact@fivepoints.tn>',\r\n                    to: evaluations[i].profile['email'],\r\n                    subject: `FivePoints: Evaluation test (${evaluations[i]['test']['title']})`,\r\n                    html: htmlContent_1.HtmlContent.EvalInvitation(evaluations[i]['test']['title'], 'https://fivepoints.fr/test/' + evaluations[i]['uuid'], `${evaluations[i].profile['name']} ${evaluations[i].profile['lastname']}`),\r\n                };\r\n                messages.push(message);\r\n            }\r\n            this.sendEmailsEvalInvitations(messages);\r\n            evaluations = yield this.evaluationModel.find().populate('pool Pool').populate('profile Profiles').sort('-createdDate').populate('test Test').exec();\r\n            return evaluations;\r\n        });\r\n    }\r\n    createTest(test) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const createdTest = new this.testModel(test);\r\n            return yield createdTest.save();\r\n        });\r\n    }\r\n    updateTest(id, test) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.testModel.findByIdAndUpdate({ _id: id }, { $set: test }).exec();\r\n        });\r\n    }\r\n    sendmail(emails, sub, content) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const smtpMyMailConfig = smtpPool({\r\n                host: 'chehir.tn',\r\n                port: 465,\r\n                secure: true,\r\n                auth: {\r\n                    user: 'fivep@chehir.tn',\r\n                    pass: 'Aaaa0000',\r\n                },\r\n                maxConnections: 5,\r\n                maxMessages: 10,\r\n                rateLimit: 5,\r\n            });\r\n            this.transporter = yield nodemailer.createTransport(smtpMyMailConfig, {\r\n                pool: true,\r\n            });\r\n            let messages = [];\r\n            emails.forEach(email => {\r\n                messages.push({\r\n                    from: 'FivePoints <contact@fivepoints.tn>',\r\n                    to: email,\r\n                    subject: sub,\r\n                    html: `${content}`,\r\n                });\r\n            });\r\n            yield this.transporter.on('idle', () => __awaiter(this, void 0, void 0, function* () {\r\n                while (this.transporter.isIdle() && messages.length) {\r\n                    yield this.transporter.sendMail(messages.shift(), (error, info) => {\r\n                        if (error) { }\r\n                    });\r\n                }\r\n            }));\r\n        });\r\n    }\r\n    findAllEvaluations() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.evaluationModel.find().populate('pool Pool').populate('profile Profiles').sort('-createdDate').populate('test Test').exec();\r\n        });\r\n    }\r\n    findAllTests() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.testModel.find().exec();\r\n        });\r\n    }\r\n    findOne(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.evaluationModel.findById({ _id: id });\r\n        });\r\n    }\r\n    findOneByCode(code) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const result = yield this.evaluationModel.findOne({ uuid: code }, { pool: 0 }).populate({ path: 'profile', select: ['email', 'name', 'lastname'] }).populate({ path: 'test', select: ['title', 'duration', 'description', 'quizes', 'type'] }).exec();\r\n            if (result) {\r\n                return result;\r\n            }\r\n            else {\r\n                return { message: 'NOTFOUND' };\r\n            }\r\n        });\r\n    }\r\n    findOneByCodeToStart(code) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const strdDate = Number.parseInt(Date.now().toString());\r\n            const resultVerif = yield this.evaluationModel.findOne({ uuid: code }, { pool: 0 }).populate({ path: 'profile', select: ['email', 'name', 'lastname'] }).populate({ path: 'test', select: ['title', 'duration', 'description', 'type'] }).exec();\r\n            if ((resultVerif.startedDate === null || resultVerif.startedDate) && resultVerif.status === 'not started') {\r\n                const result = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: { startedDate: strdDate, status: 'started' } })\r\n                    .populate({ path: 'profile', select: ['email', 'name', 'lastname'] })\r\n                    .populate({ path: 'test', select: ['title', 'duration', 'description', 'type'] }).exec();\r\n                const codeObj = result;\r\n                if (codeObj) {\r\n                    codeObj['startedDate'] = strdDate;\r\n                    codeObj['status'] = 'started';\r\n                    return codeObj;\r\n                }\r\n                else {\r\n                    return { message: 'NOTFOUND' };\r\n                }\r\n            }\r\n            else {\r\n                return resultVerif;\r\n            }\r\n        });\r\n    }\r\n    findOneByCodeToSubmit(code, testObj) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const endDate = Number.parseInt(Date.now().toString());\r\n            testObj['submitDate'] = endDate;\r\n            const result = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();\r\n            return result;\r\n        });\r\n    }\r\n    findOneByCodeToSubmitQuiz(code, testObj) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const endDate = Number.parseInt(Date.now().toString());\r\n            testObj['submitDate'] = endDate;\r\n            const result = yield this.evaluationModel.findOne({ uuid: code })\r\n                .populate({ path: 'test' }).populate({ path: 'profile' }).exec();\r\n            if (result.status === 'started') {\r\n                if (result.test['type'] === 'quiz') {\r\n                    const profileAnswers = testObj['answers'];\r\n                    const as = result.test['quizAnswers'];\r\n                    let profileTotalAnswersCounter = 0;\r\n                    let profileCorrectAnswersCounter = 0;\r\n                    for (let i = 0; i < Object.keys(as).length; i++) {\r\n                        const a = as[i];\r\n                        if (profileAnswers[i] === 0 || profileAnswers[i]) {\r\n                            profileTotalAnswersCounter++;\r\n                            if (profileAnswers[i] === a) {\r\n                                profileCorrectAnswersCounter++;\r\n                            }\r\n                            else {\r\n                            }\r\n                        }\r\n                    }\r\n                    testObj['status'] = 'finished';\r\n                    testObj['resultPercent'] = Math.round(profileCorrectAnswersCounter * 100 / as.length);\r\n                    testObj['correctAnswers'] = profileCorrectAnswersCounter;\r\n                    testObj['ProfileAnswers'] = profileAnswers;\r\n                    testObj['profileTotalAnswers'] = profileTotalAnswersCounter;\r\n                    const result2 = yield this.evaluationModel.findOneAndUpdate({ uuid: code }, { $set: testObj }).exec();\r\n                    const emailsToSend = [];\r\n                    const message = {};\r\n                    message['email'] = result.profile['email'];\r\n                    message['title'] = `FivePoints: Evaluation results (${result.test['title']})`;\r\n                    message['profilename'] = `${result['profile']['name']} ${result['profile']['lastname']}`;\r\n                    emailsToSend.push({\r\n                        from: 'FivePoints <contact@fivepoints.tn>',\r\n                        to: result['profile']['email'],\r\n                        subject: `FivePoints: Evaluation results (${result.test['title']})`,\r\n                        html: htmlContent_1.HtmlContent.evalResult(result['test']['title'], `${testObj['resultPercent']} %`, `${result['profile']['name']} ${result['profile']['lastname']}`),\r\n                    });\r\n                    this.sendEmailsEvalInvitations(emailsToSend);\r\n                    return result2;\r\n                }\r\n            }\r\n            else {\r\n                return { message: 'error' };\r\n            }\r\n        });\r\n    }\r\n    runCode(text) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const timestamp = Date.now();\r\n            const temporaryDir = `/home/adminubuntu/portal/back/${timestamp}/`;\r\n            const temporaryFile = `${timestamp}`;\r\n            let child, child2;\r\n            let content;\r\n            const file = path.join(temporaryDir, temporaryFile);\r\n            yield fs.mkdirp(path.dirname(file));\r\n            switch (text.language) {\r\n                case 'Javascript':\r\n                    content = `var start = +new Date();\r\n\r\n${text.text}\r\n\r\nvar end = +new Date();\r\nconsole.log(\"Process took \" + (end-start) + \" milliseconds\");\r\n`;\r\n                    yield fs.writeFile(file, content);\r\n                    child = childP.spawnSync('sudo', ['docker', 'run', '--rm', '-v', `${temporaryDir}:/usr/src/app`, '-w', '/usr/src/app', 'node:8', 'node', `${temporaryFile}`, 'hello']);\r\n                    break;\r\n                case 'PHP':\r\n                    content = `\r\n        <?php\r\n      $time1 = microtime(true);\r\n      ?>\r\n      ${text.text}\r\n      echo \"\\nProcess took \". number_format(microtime(true) - $time1, 6). \" seconds.\";\r\n      `;\r\n                    yield fs.writeFile(file, content);\r\n                    child = childP.spawnSync('sudo', ['docker', 'run', '--rm', '-v', `${temporaryDir}:/home`, 'php:cli', 'php', `/home/${temporaryFile}`, 'hello']);\r\n                    break;\r\n                case 'JAVA':\r\n                    content = `${text.text}`;\r\n                    const filejava = path.join(temporaryDir, 'Main.java');\r\n                    yield fs.writeFile(filejava, content);\r\n                    child2 = yield childP.spawnSync('sudo', ['docker', 'run', '--rm', '-v', `${temporaryDir}:/usr/src/hello-docker`, '-w', `/usr/src/hello-docker`, 'openjdk:8', 'javac', `Main.java`]);\r\n                    child = yield childP.spawnSync('sudo', ['docker', 'run', '--rm', '-v', `${temporaryDir}:/usr/src/hello-docker`, '-w', `/usr/src/hello-docker`, 'openjdk:8', 'java', `Main`]);\r\n                    break;\r\n                case 'Python':\r\n                    content = `import os\r\nfrom datetime import datetime\r\nstart_time = datetime.now()\r\n${text.text}\r\ntime_elapsed = datetime.now() - start_time\r\nprint('Process took {}'.format(time_elapsed))\r\n        `;\r\n                    yield fs.writeFile(file, content);\r\n                    child = childP.spawnSync('sudo', ['docker', 'run', '--rm', '-v', `${temporaryDir}:/app`, '-w', '/app', 'iron/python:2', 'python', `${temporaryFile}`]);\r\n                    break;\r\n                default:\r\n                    return 'error';\r\n            }\r\n            yield fs.remove(path.join('/home/adminubuntu/portal/back' + `/${timestamp}`));\r\n            let consoleOut = '';\r\n            if (child2) {\r\n                if (child2.stdout !== undefined) {\r\n                    consoleOut += child2.stdout.toString();\r\n                }\r\n                if (child2.error !== undefined) {\r\n                    consoleOut += child2.error.toString();\r\n                }\r\n                if (child2.stderr !== undefined) {\r\n                    consoleOut += child2.stderr.toString();\r\n                }\r\n            }\r\n            if (child.stdout !== undefined) {\r\n                consoleOut += child.stdout.toString();\r\n            }\r\n            if (child.error !== undefined) {\r\n                consoleOut += child.error.toString();\r\n            }\r\n            if (child.stderr !== undefined) {\r\n                consoleOut += child.stderr.toString();\r\n            }\r\n            return consoleOut;\r\n        });\r\n    }\r\n    createResultEmail(emails) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const messages = [];\r\n            emails.forEach(emailReq => {\r\n                const message = {\r\n                    from: 'FivePoints <contact@fivepoints.tn>',\r\n                    to: emailReq.email,\r\n                    subject: emailReq.title,\r\n                    html: htmlContent_1.HtmlContent.EvalInvitation(emailReq.title, emailReq.link, emailReq.profilename),\r\n                };\r\n                messages.push(message);\r\n            });\r\n            this.sendEmailsEvalInvitations(messages);\r\n        });\r\n    }\r\n    sendEmailsEvalInvitations(messages) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const smtpMyMailConfig = smtpPool({\r\n                host: 'chehir.tn',\r\n                port: 465,\r\n                secure: true,\r\n                auth: {\r\n                    user: 'fivep@chehir.tn',\r\n                    pass: 'Aaaa0000',\r\n                },\r\n                maxConnections: 5,\r\n                maxMessages: 10,\r\n                rateLimit: 5,\r\n            });\r\n            this.transporter = yield nodemailer.createTransport(smtpMyMailConfig, {\r\n                pool: true,\r\n            });\r\n            yield this.transporter.on('idle', () => __awaiter(this, void 0, void 0, function* () {\r\n                while (this.transporter.isIdle() && messages.length) {\r\n                    yield this.transporter.sendMail(messages.shift(), (error, info) => {\r\n                        if (error) {\r\n                        }\r\n                    });\r\n                }\r\n            }));\r\n        });\r\n    }\r\n};\r\nEvaluationService = __decorate([\r\n    common_1.Injectable(),\r\n    __param(0, mongoose_2.InjectModel(evaluation_schema_1.EvaluationSchema)),\r\n    __param(1, mongoose_2.InjectModel(test_schema_1.TestSchema)),\r\n    __param(2, mongoose_2.InjectModel(profile_schema_1.ProfileSchema)),\r\n    __param(3, mongoose_2.InjectModel(pool_schema_1.PoolSchema)),\r\n    __metadata(\"design:paramtypes\", [mongoose_1.Model,\r\n        mongoose_1.Model,\r\n        mongoose_1.Model,\r\n        mongoose_1.Model])\r\n], EvaluationService);\r\nexports.EvaluationService = EvaluationService;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/evaluation/evaluation.service.ts?");

/***/ }),

/***/ "./src/modules/api/evaluation/htmlContent.ts":
/*!***************************************************!*\
  !*** ./src/modules/api/evaluation/htmlContent.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass HtmlContent {\r\n    static EvalInvitation(testname, testLink, profilename) {\r\n        return `<!DOCTYPE html>\r\n        <html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\r\n        \r\n        <head>\r\n            <meta charset=\"utf-8\">\r\n            <!-- utf-8 works for most cases -->\r\n            <meta name=\"viewport\" content=\"width=device-width\">\r\n            <!-- Forcing initial-scale shouldn't be necessary -->\r\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n            <!-- Use the latest (edge) version of IE rendering engine -->\r\n            <meta name=\"x-apple-disable-message-reformatting\">\r\n            <!-- Disable auto-scale in iOS 10 Mail entirely -->\r\n            <title></title>\r\n            <!-- The title tag shows in email notifications, like Android 4.4. -->\r\n        \r\n            <!-- Web Font / @font-face : BEGIN -->\r\n            <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->\r\n        \r\n            <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->\r\n            <!--[if mso]>\r\n                        <style>\r\n                            * {\r\n                                font-family: sans-serif !important;\r\n                            }\r\n                        </style>\r\n                    <![endif]-->\r\n        \r\n            <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->\r\n            <!--[if !mso]><!-->\r\n            <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->\r\n            <!--<![endif]-->\r\n        \r\n            <!-- Web Font / @font-face : END -->\r\n        \r\n            <!-- CSS Reset : BEGIN -->\r\n            <style>\r\n                /* What it does: Remove spaces around the email design added by some email clients. */\r\n        \r\n                /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */\r\n        \r\n                html,\r\n                body {\r\n                    margin: 0 auto !important;\r\n                    padding: 0 !important;\r\n                    height: 100% !important;\r\n                    width: 100% !important;\r\n                }\r\n        \r\n                /* What it does: Stops email clients resizing small text. */\r\n        \r\n                * {\r\n                    -ms-text-size-adjust: 100%;\r\n                    -webkit-text-size-adjust: 100%;\r\n                }\r\n        \r\n                /* What it does: Centers email on Android 4.4 */\r\n        \r\n                div[style*=\"margin: 16px 0\"] {\r\n                    margin: 0 !important;\r\n                }\r\n        \r\n                /* What it does: Stops Outlook from adding extra spacing to tables. */\r\n        \r\n                table,\r\n                td {\r\n                    mso-table-lspace: 0pt !important;\r\n                    mso-table-rspace: 0pt !important;\r\n                }\r\n        \r\n                /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */\r\n        \r\n                table {\r\n                    border-spacing: 0 !important;\r\n                    border-collapse: collapse !important;\r\n                    table-layout: fixed !important;\r\n                    margin: 0 auto !important;\r\n                }\r\n        \r\n                table table table {\r\n                    table-layout: auto;\r\n                }\r\n        \r\n                /* What it does: Uses a better rendering method when resizing images in IE. */\r\n        \r\n                img {\r\n                    -ms-interpolation-mode: bicubic;\r\n                }\r\n        \r\n                /* What it does: A work-around for email clients meddling in triggered links. */\r\n        \r\n                *[x-apple-data-detectors],\r\n                /* iOS */\r\n        \r\n                .x-gmail-data-detectors,\r\n                /* Gmail */\r\n        \r\n                .x-gmail-data-detectors *,\r\n                .aBn {\r\n                    border-bottom: 0 !important;\r\n                    cursor: default !important;\r\n                    color: inherit !important;\r\n                    text-decoration: none !important;\r\n                    font-size: inherit !important;\r\n                    font-family: inherit !important;\r\n                    font-weight: inherit !important;\r\n                    line-height: inherit !important;\r\n                }\r\n        \r\n                /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */\r\n        \r\n                .a6S {\r\n                    display: none !important;\r\n                    opacity: 0.01 !important;\r\n                }\r\n        \r\n                /* If the above doesn't work, add a .g-img class to any image in question. */\r\n        \r\n                img.g-img+div {\r\n                    display: none !important;\r\n                }\r\n        \r\n                /* What it does: Prevents underlining the button text in Windows 10 */\r\n        \r\n                .button-link {\r\n                    text-decoration: none !important;\r\n                }\r\n        \r\n        \r\n                /* Create one of these media queries for each additional viewport size you'd like to fix */\r\n        \r\n                /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */\r\n        \r\n                @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {\r\n                    .email-container {\r\n                        min-width: 320px !important;\r\n                    }\r\n                }\r\n        \r\n                /* iPhone 6, 6S, 7, 8, and X */\r\n        \r\n                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {\r\n                    .email-container {\r\n                        min-width: 375px !important;\r\n                    }\r\n                }\r\n        \r\n                /* iPhone 6+, 7+, and 8+ */\r\n        \r\n                @media only screen and (min-device-width: 414px) {\r\n                    .email-container {\r\n                        min-width: 414px !important;\r\n                    }\r\n                }\r\n            </style>\r\n            <!-- CSS Reset : END -->\r\n        \r\n            <!-- Progressive Enhancements : BEGIN -->\r\n            <style>\r\n                /* What it does: Hover styles for buttons */\r\n        \r\n                .button-td,\r\n                .button-a {\r\n                    transition: all 100ms ease-in;\r\n                }\r\n        \r\n                .button-td:hover,\r\n                .button-a:hover {\r\n                    background: #555555 !important;\r\n                    border-color: #555555 !important;\r\n                }\r\n        \r\n                /* Media Queries */\r\n        \r\n                @media screen and (max-width: 600px) {\r\n        \r\n                    /* What it does: Adjust typography on small screens to improve readability */\r\n                    .email-container p {\r\n                        font-size: 17px !important;\r\n                    }\r\n        \r\n                }\r\n            </style>\r\n            <!-- Progressive Enhancements : END -->\r\n        \r\n            <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->\r\n            <!--[if gte mso 9]>\r\n                    <xml>\r\n                        <o:OfficeDocumentSettings>\r\n                            <o:AllowPNG/>\r\n                            <o:PixelsPerInch>96</o:PixelsPerInch>\r\n                        </o:OfficeDocumentSettings>\r\n                    </xml>\r\n                    <![endif]-->\r\n        \r\n        </head>\r\n        <!--\r\n                    The email background color (#222222) is defined in three places:\r\n                    1. body tag: for most email clients\r\n                    2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr\r\n                    3. mso conditional: For Windows 10 Mail\r\n                -->\r\n        \r\n        <body width=\"100%\" bgcolor=\"#222222\" style=\"margin: 0; mso-line-height-rule: exactly;\">\r\n            <center style=\"width: 100%; background: #222222; text-align: left;\">\r\n                <!--[if mso | IE]>\r\n                    <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#222222\">\r\n                    <tr>\r\n                    <td>\r\n                    <![endif]-->\r\n        \r\n                <!-- Visually Hidden Preheader Text : BEGIN -->\r\n                <div style=\"display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;\">\r\n                FivePoints: Evaluation test (${testname})\r\n                </div>\r\n                <!-- Visually Hidden Preheader Text : END -->\r\n        \r\n                <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->\r\n                <!-- Preview Text Spacing Hack : BEGIN -->\r\n                <div style=\"display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;\">\r\n                    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;\r\n                </div>\r\n                <!-- Preview Text Spacing Hack : END -->\r\n        \r\n                <!--\r\n                            Set the email width. Defined in two places:\r\n                            1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.\r\n                            2. MSO tags for Desktop Windows Outlook enforce a 600px width.\r\n                        -->\r\n                <div style=\"max-width: 600px; margin: auto;\" class=\"email-container\">\r\n                    <!--[if mso]>\r\n                            <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"600\" align=\"center\">\r\n                            <tr>\r\n                            <td>\r\n                            <![endif]-->\r\n        \r\n                    <!-- Email Header : BEGIN -->\r\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\" style=\"max-width: 600px;\">\r\n                        <tr>\r\n                            <td style=\"padding: 20px 0; text-align: center\">\r\n        \r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                    <!-- Email Header : END -->\r\n        \r\n                    <!-- Email Body : BEGIN -->\r\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\" style=\"max-width: 600px;\">\r\n        \r\n                        <!-- Hero Image, Flush : BEGIN -->\r\n                        <tr>\r\n                            <td bgcolor=\"#ffffff\" align=\"center\">\r\n                                <img src=\"https://scontent.ftun3-1.fna.fbcdn.net/v/t1.0-9/37689292_1922072597856819_470178092892028928_n.png?_nc_cat=0&oh=8e1e17b951b577a9b557f6b56159ae64&oe=5C0E6CFD\"\r\n                                    width=\"100%\" height=\"\" alt=\"alt_text\" border=\"0\" align=\"center\" style=\"width: 100%; max-width: 200px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; margin: auto;\"\r\n                                    class=\"g-img\">\r\n                            </td>\r\n                        </tr>\r\n                        <!-- Hero Image, Flush : END -->\r\n        \r\n                        <!-- 1 Column Text + Button : BEGIN -->\r\n                        <tr>\r\n                            <td bgcolor=\"#ffffff\">\r\n                                <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\r\n                                    <tbody>\r\n                                        <tr>\r\n                                            <td style=\"padding:40px;font-family:sans-serif;font-size:15px;line-height:140%;color:#555555\">\r\n                                                <h2 style=\"margin:0 0 10px 0;\">\r\n                                                    <center> Evaluation Invitation From FivePoints\r\n        \r\n                                                        <br>\r\n                                                    </center>\r\n                                                </h2>\r\n                                                <h4>\r\n                                                    <center>\r\n         \r\n                                                        <h4>Hello ${profilename}, You have been invited by FivePoints to take this test: \"${testname}\". Please follow the link below to begin your evaluation.\r\n\r\n                                                        </h4>\r\n                                                    </center>\r\n        \r\n                                                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" style=\"margin:auto\">\r\n                                                        <tbody>\r\n                                                            <tr>\r\n                                                                <td style=\"border-radius:3px;background:#222222;text-align:center\" class=\"m_2375839874429203999button-td\">\r\n                                                                   <a href=\"${testLink}\" style=\"background: #222222; border: 15px solid #222222; font-family: sans-serif; font-size: 13px; line-height: 110%; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;\"\r\n                                                                class=\"button-a\">\r\n                                                                <span style=\"color:#ffffff;\" class=\"button-link\">&nbsp;&nbsp;&nbsp;&nbsp;Begin the test&nbsp;&nbsp;&nbsp;&nbsp;</span>\r\n                                                            </a>\r\n                                                                </td>\r\n                                                            </tr>\r\n                                                        </tbody>\r\n                                                    </table>\r\n        \r\n                                                </h4>\r\n                                            </td>\r\n                                        </tr>\r\n                                    </tbody>\r\n                                </table>\r\n                            </td>\r\n                        </tr>\r\n                        <!-- Two Even Columns : END -->\r\n        \r\n                        <!-- Clear Spacer : BEGIN -->\r\n                        <tr>\r\n        \r\n                    </table>\r\n                    <!-- Email Body : END -->\r\n        \r\n                    <!-- Email Footer : BEGIN -->\r\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\" style=\" color: #888888;max-width: 600px;\">\r\n                        <tr>\r\n                            <td style=\"padding: 40px 10px; font-family: sans-serif; font-size: 12px; line-height: 140%; text-align: center; color: #888888;\"\r\n                                class=\"x-gmail-data-detectors\">\r\n                                <!--                         <webversion style=\"color: #cccccc; text-decoration: underline; font-weight: bold;\">View as a Web Page</webversion>\r\n                 -->\r\n                                <br>\r\n                                <br> Five Points The Talent Pool\r\n                                <br>Avenue de la bourse, immeuble wafa, bloc A 2 eme étage. 1053 Tunis, Tunisia\r\n                                <br>71 190 418\r\n                                <br>\r\n                                <br>\r\n                                <!--                         <unsubscribe style=\"color: #888888; text-decoration: underline;\">unsubscribe</unsubscribe>\r\n                 -->\r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                    <!-- Email Footer : END -->\r\n        \r\n                    <!--[if mso]>\r\n                            </td>\r\n                            </tr>\r\n                            </table>\r\n                            <![endif]-->\r\n                </div>\r\n        \r\n                <!-- Full Bleed Background Section : BEGIN -->\r\n                <!--   <table role=\"presentation\" bgcolor=\"#709f2b\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\">\r\n                            <tr>\r\n                                <td valign=\"top\" align=\"center\">\r\n                                    <div style=\"max-width: 600px; margin: auto;\" class=\"email-container\">\r\n                                        <!--[if mso]>\r\n                                        <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"600\" align=\"center\">\r\n                                        <tr>\r\n                                        <td>\r\n                                        <![endif]-->\r\n                <!--   <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\r\n                                            <tr>\r\n                                                <td style=\"padding: 40px; text-align: left; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #ffffff;\">\r\n                                                    <p style=\"margin: 0;\">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut&nbsp;erat.</p>\r\n                                                </td>\r\n                                            </tr>\r\n                                        </table> -->\r\n                <!--[if mso]>\r\n                                        </td>\r\n                                        </tr>\r\n                                        </table>\r\n                                        <![endif]-->\r\n                <!--      </div>\r\n                                </td>\r\n                            </tr>\r\n                        </table> -->\r\n                <!-- Full Bleed Background Section : END -->\r\n        \r\n                <!--[if mso | IE]>\r\n                    </td>\r\n                    </tr>\r\n                    </table>\r\n                    <![endif]-->\r\n            </center>\r\n        </body>\r\n        \r\n        </html>`;\r\n    }\r\n    static evalResult(testname, results, profilename) {\r\n        return `<!DOCTYPE html>\r\n        <html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\r\n        \r\n        <head>\r\n            <meta charset=\"utf-8\">\r\n            <!-- utf-8 works for most cases -->\r\n            <meta name=\"viewport\" content=\"width=device-width\">\r\n            <!-- Forcing initial-scale shouldn't be necessary -->\r\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n            <!-- Use the latest (edge) version of IE rendering engine -->\r\n            <meta name=\"x-apple-disable-message-reformatting\">\r\n            <!-- Disable auto-scale in iOS 10 Mail entirely -->\r\n            <title></title>\r\n            <!-- The title tag shows in email notifications, like Android 4.4. -->\r\n        \r\n            <!-- Web Font / @font-face : BEGIN -->\r\n            <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->\r\n        \r\n            <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->\r\n            <!--[if mso]>\r\n                        <style>\r\n                            * {\r\n                                font-family: sans-serif !important;\r\n                            }\r\n                        </style>\r\n                    <![endif]-->\r\n        \r\n            <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->\r\n            <!--[if !mso]><!-->\r\n            <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->\r\n            <!--<![endif]-->\r\n        \r\n            <!-- Web Font / @font-face : END -->\r\n        \r\n            <!-- CSS Reset : BEGIN -->\r\n            <style>\r\n                /* What it does: Remove spaces around the email design added by some email clients. */\r\n        \r\n                /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */\r\n        \r\n                html,\r\n                body {\r\n                    margin: 0 auto !important;\r\n                    padding: 0 !important;\r\n                    height: 100% !important;\r\n                    width: 100% !important;\r\n                }\r\n        \r\n                /* What it does: Stops email clients resizing small text. */\r\n        \r\n                * {\r\n                    -ms-text-size-adjust: 100%;\r\n                    -webkit-text-size-adjust: 100%;\r\n                }\r\n        \r\n                /* What it does: Centers email on Android 4.4 */\r\n        \r\n                div[style*=\"margin: 16px 0\"] {\r\n                    margin: 0 !important;\r\n                }\r\n        \r\n                /* What it does: Stops Outlook from adding extra spacing to tables. */\r\n        \r\n                table,\r\n                td {\r\n                    mso-table-lspace: 0pt !important;\r\n                    mso-table-rspace: 0pt !important;\r\n                }\r\n        \r\n                /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */\r\n        \r\n                table {\r\n                    border-spacing: 0 !important;\r\n                    border-collapse: collapse !important;\r\n                    table-layout: fixed !important;\r\n                    margin: 0 auto !important;\r\n                }\r\n        \r\n                table table table {\r\n                    table-layout: auto;\r\n                }\r\n        \r\n                /* What it does: Uses a better rendering method when resizing images in IE. */\r\n        \r\n                img {\r\n                    -ms-interpolation-mode: bicubic;\r\n                }\r\n        \r\n                /* What it does: A work-around for email clients meddling in triggered links. */\r\n        \r\n                *[x-apple-data-detectors],\r\n                /* iOS */\r\n        \r\n                .x-gmail-data-detectors,\r\n                /* Gmail */\r\n        \r\n                .x-gmail-data-detectors *,\r\n                .aBn {\r\n                    border-bottom: 0 !important;\r\n                    cursor: default !important;\r\n                    color: inherit !important;\r\n                    text-decoration: none !important;\r\n                    font-size: inherit !important;\r\n                    font-family: inherit !important;\r\n                    font-weight: inherit !important;\r\n                    line-height: inherit !important;\r\n                }\r\n        \r\n                /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */\r\n        \r\n                .a6S {\r\n                    display: none !important;\r\n                    opacity: 0.01 !important;\r\n                }\r\n        \r\n                /* If the above doesn't work, add a .g-img class to any image in question. */\r\n        \r\n                img.g-img+div {\r\n                    display: none !important;\r\n                }\r\n        \r\n                /* What it does: Prevents underlining the button text in Windows 10 */\r\n        \r\n                .button-link {\r\n                    text-decoration: none !important;\r\n                }\r\n        \r\n        \r\n                /* Create one of these media queries for each additional viewport size you'd like to fix */\r\n        \r\n                /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */\r\n        \r\n                @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {\r\n                    .email-container {\r\n                        min-width: 320px !important;\r\n                    }\r\n                }\r\n        \r\n                /* iPhone 6, 6S, 7, 8, and X */\r\n        \r\n                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {\r\n                    .email-container {\r\n                        min-width: 375px !important;\r\n                    }\r\n                }\r\n        \r\n                /* iPhone 6+, 7+, and 8+ */\r\n        \r\n                @media only screen and (min-device-width: 414px) {\r\n                    .email-container {\r\n                        min-width: 414px !important;\r\n                    }\r\n                }\r\n            </style>\r\n            <!-- CSS Reset : END -->\r\n        \r\n            <!-- Progressive Enhancements : BEGIN -->\r\n            <style>\r\n                /* What it does: Hover styles for buttons */\r\n        \r\n                .button-td,\r\n                .button-a {\r\n                    transition: all 100ms ease-in;\r\n                }\r\n        \r\n                .button-td:hover,\r\n                .button-a:hover {\r\n                    background: #555555 !important;\r\n                    border-color: #555555 !important;\r\n                }\r\n        \r\n                /* Media Queries */\r\n        \r\n                @media screen and (max-width: 600px) {\r\n        \r\n                    /* What it does: Adjust typography on small screens to improve readability */\r\n                    .email-container p {\r\n                        font-size: 17px !important;\r\n                    }\r\n        \r\n                }\r\n            </style>\r\n            <!-- Progressive Enhancements : END -->\r\n        \r\n            <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->\r\n            <!--[if gte mso 9]>\r\n                    <xml>\r\n                        <o:OfficeDocumentSettings>\r\n                            <o:AllowPNG/>\r\n                            <o:PixelsPerInch>96</o:PixelsPerInch>\r\n                        </o:OfficeDocumentSettings>\r\n                    </xml>\r\n                    <![endif]-->\r\n        \r\n        </head>\r\n        <!--\r\n                    The email background color (#222222) is defined in three places:\r\n                    1. body tag: for most email clients\r\n                    2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr\r\n                    3. mso conditional: For Windows 10 Mail\r\n                -->\r\n        \r\n        <body width=\"100%\" bgcolor=\"#222222\" style=\"margin: 0; mso-line-height-rule: exactly;\">\r\n            <center style=\"width: 100%; background: #222222; text-align: left;\">\r\n                <!--[if mso | IE]>\r\n                    <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" bgcolor=\"#222222\">\r\n                    <tr>\r\n                    <td>\r\n                    <![endif]-->\r\n        \r\n                <!-- Visually Hidden Preheader Text : BEGIN -->\r\n                <div style=\"display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;\">\r\n                FivePoints: Evaluation results (${testname})                </div>\r\n                <!-- Visually Hidden Preheader Text : END -->\r\n        \r\n                <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->\r\n                <!-- Preview Text Spacing Hack : BEGIN -->\r\n                <div style=\"display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;\">\r\n                    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;\r\n                </div>\r\n                <!-- Preview Text Spacing Hack : END -->\r\n        \r\n                <!--\r\n                            Set the email width. Defined in two places:\r\n                            1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.\r\n                            2. MSO tags for Desktop Windows Outlook enforce a 600px width.\r\n                        -->\r\n                <div style=\"max-width: 600px; margin: auto;\" class=\"email-container\">\r\n                    <!--[if mso]>\r\n                            <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"600\" align=\"center\">\r\n                            <tr>\r\n                            <td>\r\n                            <![endif]-->\r\n        \r\n                    <!-- Email Header : BEGIN -->\r\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\" style=\"max-width: 600px;\">\r\n                        <tr>\r\n                            <td style=\"padding: 20px 0; text-align: center\">\r\n        \r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                    <!-- Email Header : END -->\r\n        \r\n                    <!-- Email Body : BEGIN -->\r\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\" style=\"max-width: 600px;\">\r\n        \r\n                        <!-- Hero Image, Flush : BEGIN -->\r\n                        <tr>\r\n                            <td bgcolor=\"#ffffff\" align=\"center\">\r\n                                <img src=\"https://scontent.ftun3-1.fna.fbcdn.net/v/t1.0-9/37689292_1922072597856819_470178092892028928_n.png?_nc_cat=0&oh=8e1e17b951b577a9b557f6b56159ae64&oe=5C0E6CFD\"\r\n                                    width=\"100%\" height=\"\" alt=\"alt_text\" border=\"0\" align=\"center\" style=\"width: 100%; max-width: 200px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; margin: auto;\"\r\n                                    class=\"g-img\">\r\n                            </td>\r\n                        </tr>\r\n                        <!-- Hero Image, Flush : END -->\r\n        \r\n                        <!-- 1 Column Text + Button : BEGIN -->\r\n                        <tr>\r\n                            <td bgcolor=\"#ffffff\">\r\n                                <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\r\n                                    <tbody>\r\n                                        <tr>\r\n                                            <td style=\"padding:40px;font-family:sans-serif;font-size:15px;line-height:140%;color:#555555\">\r\n                                                <h2 style=\"margin:0 0 10px 0;\">\r\n                                                    <center> Evaluation Results \r\n        \r\n                                                        <br>\r\n                                                    </center>\r\n                                                </h2>\r\n                                                <h4>\r\n                                                    <center>\r\n                                                        <h4>Hello ${profilename}, Results for test ${testname} are : <br>\r\n                                                        ${results}\r\n                                                        </h4>\r\n                                                    </center>\r\n        \r\n                                                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" style=\"margin:auto\">\r\n                                                        <tbody>\r\n                                                            <tr>\r\n                                                            <center>\r\n                                                                <h4>Thank you for completing your evaluation.</h4>\r\n                                                            </center>\r\n                                                                \r\n                                                            </tr>\r\n                                                        </tbody>\r\n                                                    </table>\r\n        \r\n                                                </h4>\r\n                                            </td>\r\n                                        </tr>\r\n                                    </tbody>\r\n                                </table>\r\n                            </td>\r\n                        </tr>\r\n                        <!-- Two Even Columns : END -->\r\n        \r\n                        <!-- Clear Spacer : BEGIN -->\r\n                        <tr>\r\n        \r\n                    </table>\r\n                    <!-- Email Body : END -->\r\n        \r\n                    <!-- Email Footer : BEGIN -->\r\n                    <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\" style=\" color: #888888;max-width: 600px;\">\r\n                        <tr>\r\n                            <td style=\"padding: 40px 10px; font-family: sans-serif; font-size: 12px; line-height: 140%; text-align: center; color: #888888;\"\r\n                                class=\"x-gmail-data-detectors\">\r\n                                <!--                         <webversion style=\"color: #cccccc; text-decoration: underline; font-weight: bold;\">View as a Web Page</webversion>\r\n                 -->\r\n                                <br>\r\n                                <br> Five Points The Talent Pool\r\n                                <br>Avenue de la bourse, immeuble wafa, bloc A 2 eme étage. 1053 Tunis, Tunisia\r\n                                <br>71 190 418\r\n                                <br>\r\n                                <br>\r\n                                <!--                         <unsubscribe style=\"color: #888888; text-decoration: underline;\">unsubscribe</unsubscribe>\r\n                 -->\r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                    <!-- Email Footer : END -->\r\n        \r\n                    <!--[if mso]>\r\n                            </td>\r\n                            </tr>\r\n                            </table>\r\n                            <![endif]-->\r\n                </div>\r\n        \r\n                <!-- Full Bleed Background Section : BEGIN -->\r\n                <!--   <table role=\"presentation\" bgcolor=\"#709f2b\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"center\" width=\"100%\">\r\n                            <tr>\r\n                                <td valign=\"top\" align=\"center\">\r\n                                    <div style=\"max-width: 600px; margin: auto;\" class=\"email-container\">\r\n                                        <!--[if mso]>\r\n                                        <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"600\" align=\"center\">\r\n                                        <tr>\r\n                                        <td>\r\n                                        <![endif]-->\r\n                <!--   <table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">\r\n                                            <tr>\r\n                                                <td style=\"padding: 40px; text-align: left; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #ffffff;\">\r\n                                                    <p style=\"margin: 0;\">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut&nbsp;erat.</p>\r\n                                                </td>\r\n                                            </tr>\r\n                                        </table> -->\r\n                <!--[if mso]>\r\n                                        </td>\r\n                                        </tr>\r\n                                        </table>\r\n                                        <![endif]-->\r\n                <!--      </div>\r\n                                </td>\r\n                            </tr>\r\n                        </table> -->\r\n                <!-- Full Bleed Background Section : END -->\r\n        \r\n                <!--[if mso | IE]>\r\n                    </td>\r\n                    </tr>\r\n                    </table>\r\n                    <![endif]-->\r\n            </center>\r\n        </body>\r\n        \r\n        </html>`;\r\n    }\r\n}\r\nexports.HtmlContent = HtmlContent;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/evaluation/htmlContent.ts?");

/***/ }),

/***/ "./src/modules/api/evaluation/schemas/evaluation.schema.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/api/evaluation/schemas/evaluation.schema.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.evaluationSchema = new mongoose_1.Schema({\r\n    language: String,\r\n    text: String,\r\n    submitDate: Number,\r\n    startedDate: Number,\r\n    createdDate: Number,\r\n    outOfTab: Number,\r\n    consoleOutput: String,\r\n    testOutput: String,\r\n    resultPercent: Number,\r\n    correctAnswers: Number,\r\n    ProfileAnswers: Object,\r\n    timeOutOfTabPerQuestion: Object,\r\n    timeSpentPerQuestion: Object,\r\n    profileTotalAnswers: Number,\r\n    uuid: String,\r\n    status: { type: String, enum: ['not started', 'started', 'finished'] },\r\n    profile: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile', required: true },\r\n    pool: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Pool' },\r\n    test: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Test', required: true },\r\n    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },\r\n    companySchema: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },\r\n});\r\nexports.EvaluationSchema = exports.evaluationSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/evaluation/schemas/evaluation.schema.ts?");

/***/ }),

/***/ "./src/modules/api/evaluation/schemas/test.schema.ts":
/*!***********************************************************!*\
  !*** ./src/modules/api/evaluation/schemas/test.schema.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.testSchema = new mongoose_1.Schema({\r\n    title: String,\r\n    duration: Number,\r\n    description: String,\r\n    tests: [{\r\n            input: String,\r\n            output: String,\r\n        }],\r\n    type: { type: String, enum: ['quiz', 'code'] },\r\n    quizes: [{ question: String, answers: [String] }],\r\n    quizAnswers: [Number],\r\n    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },\r\n    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },\r\n});\r\nexports.TestSchema = exports.testSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/evaluation/schemas/test.schema.ts?");

/***/ }),

/***/ "./src/modules/api/mailing/mailing.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/api/mailing/mailing.controller.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mailing_service_1 = __webpack_require__(/*! ./mailing.service */ \"./src/modules/api/mailing/mailing.service.ts\");\r\nconst logging_interceptor_1 = __webpack_require__(/*! ../common/interceptors/logging.interceptor */ \"./src/modules/api/common/interceptors/logging.interceptor.ts\");\r\nconst transform_interceptor_1 = __webpack_require__(/*! ../common/interceptors/transform.interceptor */ \"./src/modules/api/common/interceptors/transform.interceptor.ts\");\r\nlet MailingController = class MailingController {\r\n    constructor(mailingService) {\r\n        this.mailingService = mailingService;\r\n    }\r\n    findAllCampaigns() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.findAllCampaigns();\r\n        });\r\n    }\r\n    findAllTemplates() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.findAllTemplates();\r\n        });\r\n    }\r\n    createCampaign(campaign) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.createCampaign(campaign);\r\n        });\r\n    }\r\n    createTemplate(template) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.createTemplate(template);\r\n        });\r\n    }\r\n    updateTemplate(template, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.updateTemplate(id, template);\r\n        });\r\n    }\r\n    updateCampaign(campaign, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.updateCampaign(id, campaign);\r\n        });\r\n    }\r\n    deleteTemplate(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.deleteTemplate(id);\r\n        });\r\n    }\r\n    deleteCampaign(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.mailingService.deleteCampaign(id);\r\n        });\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Get('campaign'),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"findAllCampaigns\", null);\r\n__decorate([\r\n    common_1.Get('template'),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"findAllTemplates\", null);\r\n__decorate([\r\n    common_1.Post('campaign'),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"createCampaign\", null);\r\n__decorate([\r\n    common_1.Post('template'),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"createTemplate\", null);\r\n__decorate([\r\n    common_1.Put('template/:id'),\r\n    __param(0, common_1.Body()), __param(1, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"updateTemplate\", null);\r\n__decorate([\r\n    common_1.Put('campaign/:id'),\r\n    __param(0, common_1.Body()), __param(1, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"updateCampaign\", null);\r\n__decorate([\r\n    common_1.Delete('template/:id'),\r\n    __param(0, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"deleteTemplate\", null);\r\n__decorate([\r\n    common_1.Delete('campaign/:id'),\r\n    __param(0, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], MailingController.prototype, \"deleteCampaign\", null);\r\nMailingController = __decorate([\r\n    common_1.Controller('api/mailing'),\r\n    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),\r\n    __metadata(\"design:paramtypes\", [mailing_service_1.MailingService])\r\n], MailingController);\r\nexports.MailingController = MailingController;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/mailing/mailing.controller.ts?");

/***/ }),

/***/ "./src/modules/api/mailing/mailing.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/api/mailing/mailing.module.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst mailing_controller_1 = __webpack_require__(/*! ./mailing.controller */ \"./src/modules/api/mailing/mailing.controller.ts\");\r\nconst mailing_service_1 = __webpack_require__(/*! ./mailing.service */ \"./src/modules/api/mailing/mailing.service.ts\");\r\nconst campaign_schema_1 = __webpack_require__(/*! ./schemas/campaign.schema */ \"./src/modules/api/mailing/schemas/campaign.schema.ts\");\r\nconst template_schema_1 = __webpack_require__(/*! ./schemas/template.schema */ \"./src/modules/api/mailing/schemas/template.schema.ts\");\r\nconst message_schema_1 = __webpack_require__(/*! ./schemas/message.schema */ \"./src/modules/api/mailing/schemas/message.schema.ts\");\r\nlet MailingModule = class MailingModule {\r\n};\r\nMailingModule = __decorate([\r\n    common_1.Module({\r\n        imports: [\r\n            mongoose_1.MongooseModule.forFeature([{ name: 'Campaign', schema: campaign_schema_1.CampaignSchema }]),\r\n            mongoose_1.MongooseModule.forFeature([{ name: 'Template', schema: template_schema_1.TemplateSchema }]),\r\n            mongoose_1.MongooseModule.forFeature([{ name: 'Message', schema: message_schema_1.MessageSchema }]),\r\n        ],\r\n        controllers: [mailing_controller_1.MailingController],\r\n        providers: [mailing_service_1.MailingService],\r\n    })\r\n], MailingModule);\r\nexports.MailingModule = MailingModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/mailing/mailing.module.ts?");

/***/ }),

/***/ "./src/modules/api/mailing/mailing.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/api/mailing/mailing.service.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst campaign_schema_1 = __webpack_require__(/*! ./schemas/campaign.schema */ \"./src/modules/api/mailing/schemas/campaign.schema.ts\");\r\nconst template_schema_1 = __webpack_require__(/*! ./schemas/template.schema */ \"./src/modules/api/mailing/schemas/template.schema.ts\");\r\nconst nodemailer = __webpack_require__(/*! nodemailer */ \"nodemailer\");\r\nconst smtpPool = __webpack_require__(/*! nodemailer-smtp-pool */ \"nodemailer-smtp-pool\");\r\nconst message_schema_1 = __webpack_require__(/*! ./schemas/message.schema */ \"./src/modules/api/mailing/schemas/message.schema.ts\");\r\nlet MailingService = class MailingService {\r\n    constructor(campaignModel, templateModel, messageModel) {\r\n        this.campaignModel = campaignModel;\r\n        this.templateModel = templateModel;\r\n        this.messageModel = messageModel;\r\n    }\r\n    createTemplate(template) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const createdTemplate = new this.templateModel(template);\r\n            return yield createdTemplate.save();\r\n        });\r\n    }\r\n    updateTemplate(id, template) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.templateModel.findByIdAndUpdate({ _id: id }, { $set: template }).exec();\r\n        });\r\n    }\r\n    createCampaign(campaign) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const template = yield this.templateModel.findById(campaign.template).exec();\r\n            const messages = [];\r\n            campaign['messages'] = [];\r\n            yield campaign.emails.forEach((email) => __awaiter(this, void 0, void 0, function* () {\r\n                const message = {\r\n                    template: template['_id'], subject: campaign.subject, EmailTo: email, content: template['content'], fromEmail: campaign['fromEmail'],\r\n                    fromName: campaign['fromName'], replyToName: campaign['replyToName'], replyToEmail: campaign['replyToEmail'], sendDate: Date.now().toString(),\r\n                };\r\n                messages.push(message);\r\n            }));\r\n            campaign['sendDate'] = Date.now().toString();\r\n            campaign['status'] = 'sent';\r\n            const createdCampaign = new this.campaignModel(campaign);\r\n            const result = yield createdCampaign.save();\r\n            this.sendmail(messages, result['_id']);\r\n            return result;\r\n        });\r\n    }\r\n    findAllCampaigns() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.campaignModel.find().populate('messages Message').populate('createdBy User').populate('template Template').exec();\r\n        });\r\n    }\r\n    findAllTemplates() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.templateModel.find().exec();\r\n        });\r\n    }\r\n    updateCampaign(id, campaign) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.campaignModel.findOneAndUpdate({ _id: id }, { $set: campaign }).exec();\r\n        });\r\n    }\r\n    deleteTemplate(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.templateModel.remove({ _id: id }).exec();\r\n        });\r\n    }\r\n    deleteCampaign(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const result = yield this.campaignModel.findById(id).exec();\r\n            if (result.status === 'draft' || result.status === 'scheduled') {\r\n                return yield this.campaignModel.remove({ _id: id }).exec();\r\n            }\r\n            return { message: 'cannot delete' };\r\n        });\r\n    }\r\n    sendmail(msgs, idCampaign) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const smtpMyMailConfig = smtpPool({\r\n                host: 'chehir.tn',\r\n                port: 465,\r\n                secure: true,\r\n                auth: {\r\n                    user: 'fivep@chehir.tn',\r\n                    pass: 'Aaaa0000',\r\n                },\r\n                maxConnections: 5,\r\n                maxMessages: 10,\r\n                rateLimit: 5,\r\n            });\r\n            this.transporter = yield nodemailer.createTransport(smtpMyMailConfig, {\r\n                pool: true,\r\n            });\r\n            const messages = [];\r\n            msgs.forEach((msg) => __awaiter(this, void 0, void 0, function* () {\r\n                messages.push({\r\n                    from: `${msg.fromName} <${msg.fromEmail}>`,\r\n                    replyTo: `${msg.replyToName} <${msg.replyToEmail}>`,\r\n                    to: msg.EmailTo,\r\n                    subject: msg.subject,\r\n                    html: `${msg.content}`,\r\n                });\r\n                const msgItem = new this.messageModel(msg);\r\n                const resultmsg = yield msgItem.save();\r\n                const result = yield this.campaignModel.findByIdAndUpdate(idCampaign, { $push: { messages: resultmsg['_id'] } });\r\n            }));\r\n            yield this.transporter.on('idle', () => __awaiter(this, void 0, void 0, function* () {\r\n                while (this.transporter.isIdle() && messages.length) {\r\n                    yield this.transporter.sendMail(messages.shift(), (error, info) => {\r\n                        if (error) {\r\n                        }\r\n                    });\r\n                }\r\n            }));\r\n        });\r\n    }\r\n};\r\nMailingService = __decorate([\r\n    common_1.Injectable(),\r\n    __param(0, mongoose_2.InjectModel(campaign_schema_1.CampaignSchema)),\r\n    __param(1, mongoose_2.InjectModel(template_schema_1.TemplateSchema)),\r\n    __param(2, mongoose_2.InjectModel(message_schema_1.MessageSchema)),\r\n    __metadata(\"design:paramtypes\", [mongoose_1.Model,\r\n        mongoose_1.Model,\r\n        mongoose_1.Model])\r\n], MailingService);\r\nexports.MailingService = MailingService;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/mailing/mailing.service.ts?");

/***/ }),

/***/ "./src/modules/api/mailing/schemas/campaign.schema.ts":
/*!************************************************************!*\
  !*** ./src/modules/api/mailing/schemas/campaign.schema.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.campaignSchema = new mongoose_1.Schema({\r\n    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' }],\r\n    template: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template' },\r\n    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },\r\n    name: String,\r\n    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },\r\n    subject: String,\r\n    fromName: String,\r\n    fromEmail: String,\r\n    replyToName: String,\r\n    replyToEmail: String,\r\n    sendMode: String,\r\n    trackOpen: Boolean,\r\n    trackClick: Boolean,\r\n    status: { type: String, enum: ['draft', 'sent', 'scheduled'] },\r\n    createdDate: { type: Date, default: Date.now() },\r\n    sendDate: { type: String },\r\n});\r\nexports.CampaignSchema = exports.campaignSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/mailing/schemas/campaign.schema.ts?");

/***/ }),

/***/ "./src/modules/api/mailing/schemas/message.schema.ts":
/*!***********************************************************!*\
  !*** ./src/modules/api/mailing/schemas/message.schema.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.messageSchema = new mongoose_1.Schema({\r\n    campaign: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Campaign' },\r\n    template: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template' },\r\n    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },\r\n    subject: String,\r\n    EmailTo: String,\r\n    content: String,\r\n    fromEmail: String,\r\n    fromName: String,\r\n    replyToName: String,\r\n    replyToEmail: String,\r\n    opened: Boolean,\r\n    openedTimes: [String],\r\n    sendDate: String,\r\n    createdDate: { type: Date, default: Date.now() },\r\n});\r\nexports.MessageSchema = exports.messageSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/mailing/schemas/message.schema.ts?");

/***/ }),

/***/ "./src/modules/api/mailing/schemas/template.schema.ts":
/*!************************************************************!*\
  !*** ./src/modules/api/mailing/schemas/template.schema.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.templateSchema = new mongoose_1.Schema({\r\n    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },\r\n    name: { type: String, unique: false },\r\n    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },\r\n    content: String,\r\n    createdDate: { type: Date, default: Date.now() },\r\n});\r\nexports.TemplateSchema = exports.templateSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/mailing/schemas/template.schema.ts?");

/***/ }),

/***/ "./src/modules/api/pools/pool.controller.ts":
/*!**************************************************!*\
  !*** ./src/modules/api/pools/pool.controller.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst pool_service_1 = __webpack_require__(/*! ./pool.service */ \"./src/modules/api/pools/pool.service.ts\");\r\nconst logging_interceptor_1 = __webpack_require__(/*! ../common/interceptors/logging.interceptor */ \"./src/modules/api/common/interceptors/logging.interceptor.ts\");\r\nconst auth_guard_1 = __webpack_require__(/*! ../common/passport/auth.guard */ \"./src/modules/api/common/passport/auth.guard.ts\");\r\nconst transform_interceptor_1 = __webpack_require__(/*! ../common/interceptors/transform.interceptor */ \"./src/modules/api/common/interceptors/transform.interceptor.ts\");\r\nlet PoolsController = class PoolsController {\r\n    constructor(poolsService) {\r\n        this.poolsService = poolsService;\r\n    }\r\n    create(pool) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.poolsService.create(pool);\r\n        });\r\n    }\r\n    findAll() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.poolsService.findAll();\r\n        });\r\n    }\r\n    findAllLanding() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.poolsService.findAllLanding();\r\n        });\r\n    }\r\n    findByIdLanding(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.poolsService.findByIdLanding(id);\r\n        });\r\n    }\r\n    findone(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.poolsService.findOne(id);\r\n        });\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Post(),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], PoolsController.prototype, \"create\", null);\r\n__decorate([\r\n    common_1.UseGuards(auth_guard_1.AuthGuard('jwt')),\r\n    common_1.Get(),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], PoolsController.prototype, \"findAll\", null);\r\n__decorate([\r\n    common_1.Get('landing'),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], PoolsController.prototype, \"findAllLanding\", null);\r\n__decorate([\r\n    common_1.Get('landing/:id'),\r\n    __param(0, common_1.Param('id', new common_1.ParseIntPipe())),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], PoolsController.prototype, \"findByIdLanding\", null);\r\n__decorate([\r\n    common_1.Get(':id'),\r\n    __param(0, common_1.Param('id', new common_1.ParseIntPipe())),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], PoolsController.prototype, \"findone\", null);\r\nPoolsController = __decorate([\r\n    common_1.Controller('pools'),\r\n    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),\r\n    __metadata(\"design:paramtypes\", [pool_service_1.PoolsService])\r\n], PoolsController);\r\nexports.PoolsController = PoolsController;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/pools/pool.controller.ts?");

/***/ }),

/***/ "./src/modules/api/pools/pool.service.ts":
/*!***********************************************!*\
  !*** ./src/modules/api/pools/pool.service.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst pool_schema_1 = __webpack_require__(/*! ./schemas/pool.schema */ \"./src/modules/api/pools/schemas/pool.schema.ts\");\r\nlet PoolsService = class PoolsService {\r\n    constructor(poolModel) {\r\n        this.poolModel = poolModel;\r\n    }\r\n    create(pool) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const createdPool = new this.poolModel(pool);\r\n            return yield createdPool.save();\r\n        });\r\n    }\r\n    findAll() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.poolModel.find().populate('profiles profile').exec();\r\n        });\r\n    }\r\n    findAllLanding() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.poolModel.find({}, { title: 1, uniqueName: 1, startDate: 1, endDate: 1, Nhours: 1 }).exec();\r\n        });\r\n    }\r\n    registerProfile(poolid, profileid) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.poolModel.findOneAndUpdate({ _id: poolid }, { $push: { registred: profileid } }).exec();\r\n        });\r\n    }\r\n    findByIdLanding(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.poolModel.findById({ _id: id }, { title: 1, uniqueName: 1, startDate: 1, endDate: 1, Nhours: 1 }).exec();\r\n        });\r\n    }\r\n    findOne(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.poolModel.findById({ _id: id });\r\n        });\r\n    }\r\n};\r\nPoolsService = __decorate([\r\n    common_1.Injectable(),\r\n    __param(0, mongoose_2.InjectModel(pool_schema_1.PoolSchema)),\r\n    __metadata(\"design:paramtypes\", [mongoose_1.Model])\r\n], PoolsService);\r\nexports.PoolsService = PoolsService;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/pools/pool.service.ts?");

/***/ }),

/***/ "./src/modules/api/pools/pools.module.ts":
/*!***********************************************!*\
  !*** ./src/modules/api/pools/pools.module.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst pool_controller_1 = __webpack_require__(/*! ./pool.controller */ \"./src/modules/api/pools/pool.controller.ts\");\r\nconst pool_service_1 = __webpack_require__(/*! ./pool.service */ \"./src/modules/api/pools/pool.service.ts\");\r\nconst pool_schema_1 = __webpack_require__(/*! ./schemas/pool.schema */ \"./src/modules/api/pools/schemas/pool.schema.ts\");\r\nlet PoolsModule = class PoolsModule {\r\n};\r\nPoolsModule = __decorate([\r\n    common_1.Module({\r\n        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Pool', schema: pool_schema_1.PoolSchema }])],\r\n        controllers: [pool_controller_1.PoolsController],\r\n        providers: [pool_service_1.PoolsService],\r\n    })\r\n], PoolsModule);\r\nexports.PoolsModule = PoolsModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/pools/pools.module.ts?");

/***/ }),

/***/ "./src/modules/api/pools/schemas/pool.schema.ts":
/*!******************************************************!*\
  !*** ./src/modules/api/pools/schemas/pool.schema.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.poolSchema = new mongoose_1.Schema({\r\n    title: String,\r\n    uniqueName: { type: String, lowercase: true, unique: true, index: true },\r\n    description: String,\r\n    startDate: { type: Date, default: null },\r\n    endDate: { type: Date, min: Date.now() },\r\n    attended: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],\r\n    profiles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],\r\n    registred: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Profile' }],\r\n    Coach: String,\r\n    Nhours: Number,\r\n    NSofthours: Number,\r\n});\r\nexports.PoolSchema = exports.poolSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/pools/schemas/pool.schema.ts?");

/***/ }),

/***/ "./src/modules/api/profiles/profile.controller.ts":
/*!********************************************************!*\
  !*** ./src/modules/api/profiles/profile.controller.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst http_1 = __webpack_require__(/*! @nestjs/common/decorators/http */ \"@nestjs/common/decorators/http\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst profile_service_1 = __webpack_require__(/*! ./profile.service */ \"./src/modules/api/profiles/profile.service.ts\");\r\nconst logging_interceptor_1 = __webpack_require__(/*! ../common/interceptors/logging.interceptor */ \"./src/modules/api/common/interceptors/logging.interceptor.ts\");\r\nconst transform_interceptor_1 = __webpack_require__(/*! ../common/interceptors/transform.interceptor */ \"./src/modules/api/common/interceptors/transform.interceptor.ts\");\r\nconst multer = __webpack_require__(/*! multer */ \"multer\");\r\nlet ProfilesController = class ProfilesController {\r\n    constructor(profilesService) {\r\n        this.profilesService = profilesService;\r\n    }\r\n    create(profile) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.profilesService.create(profile);\r\n        });\r\n    }\r\n    modify(profile, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.profilesService.update(id, profile);\r\n        });\r\n    }\r\n    uploadpic(res, file, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.profilesService.profilePic(`${file.destination}${file.filename}`, id);\r\n            yield res.json(file);\r\n        });\r\n    }\r\n    upload(res, file, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.profilesService.UpdateProfileCvById(`${file.destination}${file.filename}`, id);\r\n            yield res.json(file);\r\n        });\r\n    }\r\n    uploadMany(res, file) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const cvtxt = yield this.profilesService.addProfileByCvEmail(`${file.destination}${file.filename}`);\r\n            console.log(cvtxt);\r\n            yield res.json({ file, cv: cvtxt });\r\n        });\r\n    }\r\n    search(keywords) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.profilesService.searchProfile(keywords);\r\n        });\r\n    }\r\n    findAll() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.profilesService.findAll();\r\n        });\r\n    }\r\n    findone(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.profilesService.findOne(id);\r\n        });\r\n    }\r\n    register(poolid, profile) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.profilesService.register(profile, poolid);\r\n        });\r\n    }\r\n    getCv(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.profilesService.getCvFile(id);\r\n        });\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Post(),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"create\", null);\r\n__decorate([\r\n    http_1.Put(':id'),\r\n    __param(0, common_1.Body()), __param(1, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"modify\", null);\r\n__decorate([\r\n    common_1.Post(':id/pic'),\r\n    common_1.UseInterceptors(common_1.FileInterceptor('file', {\r\n        storage: multer.diskStorage({\r\n            destination(req, file, cb) {\r\n                cb(null, 'uploads/');\r\n            },\r\n            filename(req, file, cb) {\r\n                cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));\r\n            },\r\n        }),\r\n    })),\r\n    __param(0, http_1.Res()), __param(1, common_1.UploadedFile()), __param(2, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"uploadpic\", null);\r\n__decorate([\r\n    common_1.Post(':id/cv'),\r\n    common_1.UseInterceptors(common_1.FileInterceptor('file', {\r\n        storage: multer.diskStorage({\r\n            destination(req, file, cb) {\r\n                cb(null, 'uploads/');\r\n            },\r\n            filename(req, file, cb) {\r\n                cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));\r\n            },\r\n        }),\r\n    })),\r\n    __param(0, http_1.Res()), __param(1, common_1.UploadedFile()), __param(2, common_1.Param('id', new common_1.ParseIntPipe())),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"upload\", null);\r\n__decorate([\r\n    common_1.Post('cvs'),\r\n    common_1.UseInterceptors(common_1.FileInterceptor('file', {\r\n        storage: multer.diskStorage({\r\n            destination(req, file, cb) {\r\n                cb(null, 'uploads/');\r\n            },\r\n            filename(req, file, cb) {\r\n                cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));\r\n            },\r\n        }),\r\n    })),\r\n    __param(0, http_1.Res()), __param(1, common_1.UploadedFile()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"uploadMany\", null);\r\n__decorate([\r\n    common_1.Post('search'),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"search\", null);\r\n__decorate([\r\n    common_1.Get(),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"findAll\", null);\r\n__decorate([\r\n    common_1.Get(':id'),\r\n    __param(0, common_1.Param('id', new common_1.ParseIntPipe())),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"findone\", null);\r\n__decorate([\r\n    common_1.Post(':pool'),\r\n    __param(0, common_1.Param('pool')), __param(1, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"register\", null);\r\n__decorate([\r\n    common_1.Get('cv/:id'),\r\n    __param(0, common_1.Param('id')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], ProfilesController.prototype, \"getCv\", null);\r\nProfilesController = __decorate([\r\n    common_1.Controller('api/profiles'),\r\n    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),\r\n    __metadata(\"design:paramtypes\", [profile_service_1.ProfilesService])\r\n], ProfilesController);\r\nexports.ProfilesController = ProfilesController;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/profiles/profile.controller.ts?");

/***/ }),

/***/ "./src/modules/api/profiles/profile.service.ts":
/*!*****************************************************!*\
  !*** ./src/modules/api/profiles/profile.service.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst profile_schema_1 = __webpack_require__(/*! ./schemas/profile.schema */ \"./src/modules/api/profiles/schemas/profile.schema.ts\");\r\nconst pool_service_1 = __webpack_require__(/*! ../pools/pool.service */ \"./src/modules/api/pools/pool.service.ts\");\r\nconst core_1 = __webpack_require__(/*! @nestjs/core */ \"@nestjs/core\");\r\nconst pdf2Text = __webpack_require__(/*! pdf2text */ \"pdf2text\");\r\nconst fs = __webpack_require__(/*! fs */ \"fs\");\r\nlet ProfilesService = class ProfilesService {\r\n    constructor(profileModel, moduleRef) {\r\n        this.profileModel = profileModel;\r\n        this.moduleRef = moduleRef;\r\n        this.rows = {};\r\n    }\r\n    onModuleInit() {\r\n        this.poolService = this.moduleRef.get(pool_service_1.PoolsService);\r\n    }\r\n    create(profile) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const createdProfile = new this.profileModel(profile);\r\n            return yield createdProfile.save();\r\n        });\r\n    }\r\n    register(profile, poolid) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const result = yield this.profileModel.findOne({ email: profile.email });\r\n            if (result) {\r\n                return yield this.profileModel.findOneAndUpdate({ email: profile.email }, { $push: { pools: poolid } }).exec();\r\n            }\r\n            else {\r\n                const createdProfile = new this.profileModel(profile);\r\n                return yield createdProfile.save();\r\n            }\r\n        });\r\n    }\r\n    addProfileByCvEmail(file) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            let cvtext = '';\r\n            yield pdf2Text(fs.readFileSync('./' + file)).then((pages) => __awaiter(this, void 0, void 0, function* () {\r\n                let email;\r\n                pages.forEach(page => {\r\n                    page.forEach(line => {\r\n                        if (line.includes('@')) {\r\n                            email = line;\r\n                            email = email.replace(/\\s/g, '');\r\n                        }\r\n                        cvtext += line + ' ';\r\n                    });\r\n                });\r\n                if (email) {\r\n                    const resultprofile = yield this.profileModel.findOne({ email }).exec();\r\n                    if (!resultprofile) {\r\n                        const profile = { email, cvData: cvtext, cvFile: file };\r\n                        const createdProfile = new this.profileModel(profile);\r\n                        yield createdProfile.save().catch();\r\n                    }\r\n                }\r\n            }));\r\n            return cvtext;\r\n        });\r\n    }\r\n    profilePic(file, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.profileModel.findOneAndUpdate({ _id: id }, { $set: { picFile: file } }).exec();\r\n        });\r\n    }\r\n    UpdateProfileCvById(file, id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            yield pdf2Text(fs.readFileSync(file)).then((pages) => __awaiter(this, void 0, void 0, function* () {\r\n                console.log(pages);\r\n                const skills = [];\r\n                let cvtext = '';\r\n                pages.forEach(page => {\r\n                    page.forEach(line => {\r\n                        cvtext += line + ' ';\r\n                        if (this.skillsChecker(line)) {\r\n                            skills.push(this.skillsChecker(line));\r\n                        }\r\n                    });\r\n                });\r\n                yield this.profileModel.findOneAndUpdate({ _id: id }, { $set: { cvFile: file, cvData: cvtext, skills: skills } }).exec();\r\n            }));\r\n        });\r\n    }\r\n    skillsChecker(skill) {\r\n        const skills = ['html', 'html5', 'css', 'css3', 'js', 'javascript', 'ts', 'typescript', 'node', 'nodejs',\r\n            'node.js', 'mongo', 'mongodb', 'angularjs', 'angular1', 'angular', 'angular2', 'angular4', 'angular5',\r\n            'angular6', 'express', 'expressjs', 'wp', 'wordpress', 'php', 'php5', 'php7', 'java', 'j2ee', 'jee',\r\n            'spring', 'jpa', 'jsf', 'python', 'py', 'arduino', 'android', 'mobile', 'web', 'iot', 'jwt',\r\n            'jsonwebtoken', 'laravel', 'symphony', 'codeigniter', 'cakephp', 'c#', 'asp', 'asp.net',\r\n            '.net', 'wpf', 'xamarin', 'jquery', 'bootstrap', 'react', 'vue.js', 'unity', 'ue4',\r\n            'unrealengine4', 'unreal', 'ios', 'es6', 'es5', 'es7', 'es8', 'libgdx', 'devops',\r\n            'flow', 'rxjs', 'ajax', 'sql', 'mysql', 'postgresql', 'vscode', 'tensorflow',\r\n            'oop', '2d', '3d', 'react', 'maven', 'rest', 'restful', 'core', 'chatbot',\r\n            'aws', 'azure', 'docker', 'virtualisation', 'firebase', 'unity5', 'redux',\r\n            'ecma6', 'ecma7', 'ecma8', 'ecma5', 'automatisation', 'jira', 'agile',\r\n            'scrum', 'jira', 'prestashop', 'msproject', 'tfs', 'vsts',\r\n            'woocommerce', 'cms', 'seo', 'flow', 'electronjs',\r\n            'react-native', 'native', 'unix', 'linux',\r\n            'ubuntu', 'terminal', 'bash', 'shell',\r\n            'postgre', 'virtualisation', 'android-studio',\r\n            'git', 'github', 'smo', 'django', 'webpack', 'medium',\r\n            'jenkins', 'teamcity', 'gitlab', 'w3', 'github-pages', 'joomla',\r\n            'wix', 'phpmyadmin', 'phppgadmin', 'kubernates', 'odoo', 'muse', 'excel',\r\n            'word', 'powerpoint', 'cpanel', 'plesk', 'ember', 'knockout', 'modernizr', 'meteror',\r\n            'mean', 'mean.io', 'meanjs', 'mustache', 'socket', 'socketio', 'socket-io', 'websocket',\r\n            'underscore', 'backbone', 'reddit', 'vbulletin', 'phpbb', 'pdf.js', 'owncloud', 'revslider', 'centos',\r\n            'debian', 'redhat', 'raspberrypi', 'darwin', 'suse', 'sunos', 'freebsd', 'fedora', 'raspbian', 'erlang',\r\n            'go', 'c++', 'ruby', 'scala', 'perl', 'lua', 'yoast', 'cowboy', 'materialize', 'material', 'sails', 'sailsjs',\r\n            'sails.js', 'nest', 'nestjs', 'nest.js', 'roundcube', 'squirrelmail', 'openssl', 'amber', 'apache', 'nginx', 'wampp',\r\n            'xampp', 'lampp', 'flask', 'iis', 'next.js', 'nextjs'];\r\n        skill = skill.toLocaleLowerCase();\r\n        skill = skill.trim();\r\n        return skills[skills.indexOf(skill)];\r\n    }\r\n    skillanalyse() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            let skills = [];\r\n            return yield this.profileModel.find().exec((err, res) => __awaiter(this, void 0, void 0, function* () {\r\n                yield res.forEach((profile) => __awaiter(this, void 0, void 0, function* () {\r\n                    skills = [];\r\n                    yield profile.cvData.split(' ').forEach(word => {\r\n                        if (this.skillsChecker(word)) {\r\n                            skills.push(this.skillsChecker(word));\r\n                        }\r\n                    });\r\n                    if (skills) {\r\n                        this.profileModel.findByIdAndUpdate(profile['_id'], { $set: { skills: skills } }).exec();\r\n                    }\r\n                }));\r\n            }));\r\n        });\r\n    }\r\n    searchProfile(keywords) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            let skills = '';\r\n            keywords.skills.forEach(skill => {\r\n                skills += skill;\r\n            });\r\n            console.log(skills);\r\n            return yield this.profileModel.find({ $text: { $search: skills, $caseSensitive: false } }).exec();\r\n        });\r\n    }\r\n    findAll() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.profileModel.find().populate('pools Pool').exec();\r\n        });\r\n    }\r\n    findOne(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.profileModel.findById({ _id: id });\r\n        });\r\n    }\r\n    getCvFile(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n        });\r\n    }\r\n    update(id, profile) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.profileModel.findByIdAndUpdate({ _id: id }, { $set: profile }).exec();\r\n        });\r\n    }\r\n};\r\nProfilesService = __decorate([\r\n    common_1.Injectable(),\r\n    __param(0, mongoose_2.InjectModel(profile_schema_1.ProfileSchema)),\r\n    __metadata(\"design:paramtypes\", [mongoose_1.Model, core_1.ModuleRef])\r\n], ProfilesService);\r\nexports.ProfilesService = ProfilesService;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/profiles/profile.service.ts?");

/***/ }),

/***/ "./src/modules/api/profiles/profiles.module.ts":
/*!*****************************************************!*\
  !*** ./src/modules/api/profiles/profiles.module.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst profile_controller_1 = __webpack_require__(/*! ./profile.controller */ \"./src/modules/api/profiles/profile.controller.ts\");\r\nconst profile_service_1 = __webpack_require__(/*! ./profile.service */ \"./src/modules/api/profiles/profile.service.ts\");\r\nconst profile_schema_1 = __webpack_require__(/*! ./schemas/profile.schema */ \"./src/modules/api/profiles/schemas/profile.schema.ts\");\r\nlet ProfilesModule = class ProfilesModule {\r\n};\r\nProfilesModule = __decorate([\r\n    common_1.Module({\r\n        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Profile', schema: profile_schema_1.ProfileSchema }])],\r\n        controllers: [profile_controller_1.ProfilesController],\r\n        providers: [profile_service_1.ProfilesService],\r\n    })\r\n], ProfilesModule);\r\nexports.ProfilesModule = ProfilesModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/profiles/profiles.module.ts?");

/***/ }),

/***/ "./src/modules/api/profiles/schemas/profile.schema.ts":
/*!************************************************************!*\
  !*** ./src/modules/api/profiles/schemas/profile.schema.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.profileSchema = new mongoose_1.Schema({\r\n    name: String,\r\n    lastname: String,\r\n    email: { type: String, lowercase: true, unique: true, index: true, required: true },\r\n    phone: Number,\r\n    birthday: { type: Date, max: Date.now() },\r\n    cinNumber: { type: Number, maxlength: 8 },\r\n    cinPic: String,\r\n    cvFile: String,\r\n    cvData: { type: String },\r\n    picFile: { type: String },\r\n    socials: { facebook: String, linkedin: String, github: String, twitter: String },\r\n    pools: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Pool' }],\r\n    experiences: [{\r\n            organism: String, startDate: Date, endDate: Date,\r\n            position: String, degree: String, mission: String,\r\n            experienceType: { type: String, enum: ['Academic', 'Professional', 'Social'] }\r\n        }],\r\n    skills: [{ type: String }],\r\n    jobState: { type: String },\r\n});\r\nexports.profileSchema.index({ cvData: 'text' });\r\nexports.ProfileSchema = exports.profileSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/profiles/schemas/profile.schema.ts?");

/***/ }),

/***/ "./src/modules/api/upload/upload.controller.ts":
/*!*****************************************************!*\
  !*** ./src/modules/api/upload/upload.controller.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst path = __webpack_require__(/*! path */ \"path\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst multer = __webpack_require__(/*! multer */ \"multer\");\r\nconst transform_interceptor_1 = __webpack_require__(/*! ../common/interceptors/transform.interceptor */ \"./src/modules/api/common/interceptors/transform.interceptor.ts\");\r\nconst logging_interceptor_1 = __webpack_require__(/*! ../common/interceptors/logging.interceptor */ \"./src/modules/api/common/interceptors/logging.interceptor.ts\");\r\nlet UploadController = class UploadController {\r\n    getfiles(res, name) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const file = process.env.APP_PATH + '/' + name;\r\n            res.sendFile(name, { root: path.join(process.env.APP_PATH, '/') });\r\n        });\r\n    }\r\n    upload(res, file) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            yield res.json(file);\r\n        });\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Get(':name'),\r\n    __param(0, common_1.Res()), __param(1, common_1.Param('name')),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], UploadController.prototype, \"getfiles\", null);\r\n__decorate([\r\n    common_1.Post('file'),\r\n    common_1.UseInterceptors(common_1.FileInterceptor('file', {\r\n        storage: multer.diskStorage({\r\n            destination(req, file, cb) {\r\n                cb(null, 'uploads/');\r\n            },\r\n            filename(req, file, cb) {\r\n                cb(null, Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));\r\n            },\r\n        }),\r\n    })),\r\n    __param(0, common_1.Res()), __param(1, common_1.UploadedFile()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object, Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], UploadController.prototype, \"upload\", null);\r\nUploadController = __decorate([\r\n    common_1.Controller('uploads'),\r\n    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor)\r\n], UploadController);\r\nexports.UploadController = UploadController;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/upload/upload.controller.ts?");

/***/ }),

/***/ "./src/modules/api/upload/upload.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/api/upload/upload.module.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst upload_controller_1 = __webpack_require__(/*! ./upload.controller */ \"./src/modules/api/upload/upload.controller.ts\");\r\nlet UploadModule = class UploadModule {\r\n};\r\nUploadModule = __decorate([\r\n    common_1.Module({\r\n        controllers: [\r\n            upload_controller_1.UploadController,\r\n        ],\r\n    })\r\n], UploadModule);\r\nexports.UploadModule = UploadModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/upload/upload.module.ts?");

/***/ }),

/***/ "./src/modules/api/users/schemas/user.schema.ts":
/*!******************************************************!*\
  !*** ./src/modules/api/users/schemas/user.schema.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nexports.userSchema = new mongoose_1.Schema({\r\n    name: String,\r\n    email: { type: String, required: true, index: true, unique: true, lowercase: true },\r\n    password: { type: String, required: true },\r\n    role: { type: String, enum: ['manager', 'coach', 'company', 'profile'], required: true },\r\n    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },\r\n});\r\nexports.userSchema.pre('save', (next) => {\r\n    const user = this;\r\n    const SALT_WORK_FACTOR = 10;\r\n    if (!user.isModified('password')) {\r\n        return next();\r\n    }\r\n    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {\r\n        if (err) {\r\n            return next(err);\r\n        }\r\n        bcrypt.hash(user.password, salt, (errr, hash) => {\r\n            if (err) {\r\n                return next(errr);\r\n            }\r\n            user.password = hash;\r\n            next();\r\n        });\r\n    });\r\n});\r\nexports.userSchema.methods.comparePassword = (candidatePassword, userPass, cb) => {\r\n    return bcrypt.compareSync(candidatePassword, userPass);\r\n};\r\nexports.UserSchema = exports.userSchema;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/users/schemas/user.schema.ts?");

/***/ }),

/***/ "./src/modules/api/users/user.controller.ts":
/*!**************************************************!*\
  !*** ./src/modules/api/users/user.controller.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst user_service_1 = __webpack_require__(/*! ./user.service */ \"./src/modules/api/users/user.service.ts\");\r\nconst logging_interceptor_1 = __webpack_require__(/*! ../common/interceptors/logging.interceptor */ \"./src/modules/api/common/interceptors/logging.interceptor.ts\");\r\nconst auth_guard_1 = __webpack_require__(/*! ../common/passport/auth.guard */ \"./src/modules/api/common/passport/auth.guard.ts\");\r\nconst transform_interceptor_1 = __webpack_require__(/*! ../common/interceptors/transform.interceptor */ \"./src/modules/api/common/interceptors/transform.interceptor.ts\");\r\nlet UsersController = class UsersController {\r\n    constructor(usersService) {\r\n        this.usersService = usersService;\r\n    }\r\n    create(user) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.usersService.create(user);\r\n        });\r\n    }\r\n    login(user) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.usersService.findUser(user);\r\n        });\r\n    }\r\n    register(user) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            this.usersService.create(user);\r\n        });\r\n    }\r\n    findAll() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.usersService.findAll();\r\n        });\r\n    }\r\n    findone(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return this.usersService.findOne(id);\r\n        });\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Post(),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], UsersController.prototype, \"create\", null);\r\n__decorate([\r\n    common_1.Post('login'),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], UsersController.prototype, \"login\", null);\r\n__decorate([\r\n    common_1.Post('register'),\r\n    __param(0, common_1.Body()),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], UsersController.prototype, \"register\", null);\r\n__decorate([\r\n    common_1.Get(),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", Promise)\r\n], UsersController.prototype, \"findAll\", null);\r\n__decorate([\r\n    common_1.UseGuards(auth_guard_1.AuthGuard('jwt')),\r\n    common_1.Get(':id'),\r\n    __param(0, common_1.Param('id', new common_1.ParseIntPipe())),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", [Object]),\r\n    __metadata(\"design:returntype\", Promise)\r\n], UsersController.prototype, \"findone\", null);\r\nUsersController = __decorate([\r\n    common_1.Controller('users'),\r\n    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor, transform_interceptor_1.TransformInterceptor),\r\n    __metadata(\"design:paramtypes\", [user_service_1.UsersService])\r\n], UsersController);\r\nexports.UsersController = UsersController;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/users/user.controller.ts?");

/***/ }),

/***/ "./src/modules/api/users/user.service.ts":
/*!***********************************************!*\
  !*** ./src/modules/api/users/user.service.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n};\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst mongoose_1 = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ \"./src/modules/api/users/schemas/user.schema.ts\");\r\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\r\nlet UsersService = class UsersService {\r\n    constructor(userModel) {\r\n        this.userModel = userModel;\r\n    }\r\n    create(user) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const createdUser = new this.userModel(user);\r\n            return yield createdUser.save();\r\n        });\r\n    }\r\n    findAll() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.userModel.find().exec();\r\n        });\r\n    }\r\n    findOne(id) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.userModel.findById({ _id: id });\r\n        });\r\n    }\r\n    findUser(user) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            console.log(user);\r\n            const res = yield this.userModel.findOne({ email: user.email }).exec();\r\n            if (!res) {\r\n                return { message: 'User not found' };\r\n            }\r\n            const res2 = yield res.comparePassword(user.password, res.password);\r\n            if (!res2) {\r\n                return { message: 'Wrong Password' };\r\n            }\r\n            return this.createToken(res);\r\n        });\r\n    }\r\n    createToken(user) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const expiresIn = 3600;\r\n            console.log(expiresIn);\r\n            return {\r\n                message: 'OK',\r\n                accessToken: jwt.sign({ data: user, exp: Math.floor(Date.now() / 1000) + (3600 * 24) }, 'secretKey'),\r\n            };\r\n        });\r\n    }\r\n    validateUser(payload) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            return yield this.userModel.findOne({ email: payload.data.email, pass: payload.data.pass }).exec();\r\n        });\r\n    }\r\n};\r\nUsersService = __decorate([\r\n    common_1.Injectable(),\r\n    __param(0, mongoose_2.InjectModel(user_schema_1.UserSchema)),\r\n    __metadata(\"design:paramtypes\", [mongoose_1.Model])\r\n], UsersService);\r\nexports.UsersService = UsersService;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/users/user.service.ts?");

/***/ }),

/***/ "./src/modules/api/users/users.module.ts":
/*!***********************************************!*\
  !*** ./src/modules/api/users/users.module.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ \"@nestjs/mongoose\");\r\nconst user_controller_1 = __webpack_require__(/*! ./user.controller */ \"./src/modules/api/users/user.controller.ts\");\r\nconst user_service_1 = __webpack_require__(/*! ./user.service */ \"./src/modules/api/users/user.service.ts\");\r\nconst user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ \"./src/modules/api/users/schemas/user.schema.ts\");\r\nconst jwt_strategy_1 = __webpack_require__(/*! ../common/strategy/jwt.strategy */ \"./src/modules/api/common/strategy/jwt.strategy.ts\");\r\nlet UsersModule = class UsersModule {\r\n};\r\nUsersModule = __decorate([\r\n    common_1.Module({\r\n        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_schema_1.UserSchema }])],\r\n        controllers: [user_controller_1.UsersController],\r\n        providers: [user_service_1.UsersService, jwt_strategy_1.JwtStrategy],\r\n    })\r\n], UsersModule);\r\nexports.UsersModule = UsersModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/api/users/users.module.ts?");

/***/ }),

/***/ "./src/modules/static/static.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/static/static.controller.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nlet StaticController = class StaticController {\r\n    gettimeStamp() {\r\n        return { time: Date.now() };\r\n    }\r\n};\r\n__decorate([\r\n    common_1.Get('getTimeStamp'),\r\n    __metadata(\"design:type\", Function),\r\n    __metadata(\"design:paramtypes\", []),\r\n    __metadata(\"design:returntype\", void 0)\r\n], StaticController.prototype, \"gettimeStamp\", null);\r\nStaticController = __decorate([\r\n    common_1.Controller()\r\n], StaticController);\r\nexports.StaticController = StaticController;\r\n\n\n//# sourceURL=webpack:///./src/modules/static/static.controller.ts?");

/***/ }),

/***/ "./src/modules/static/static.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/static/static.module.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\r\nconst static_controller_1 = __webpack_require__(/*! ./static.controller */ \"./src/modules/static/static.controller.ts\");\r\nlet StaticModule = class StaticModule {\r\n};\r\nStaticModule = __decorate([\r\n    common_1.Module({\r\n        imports: [],\r\n        controllers: [static_controller_1.StaticController],\r\n        providers: [],\r\n    })\r\n], StaticModule);\r\nexports.StaticModule = StaticModule;\r\n\n\n//# sourceURL=webpack:///./src/modules/static/static.module.ts?");

/***/ }),

/***/ 0:
/*!*****************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/main.hmr.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! webpack/hot/poll?1000 */\"./node_modules/webpack/hot/poll.js?1000\");\nmodule.exports = __webpack_require__(/*! ./src/main.hmr.ts */\"./src/main.hmr.ts\");\n\n\n//# sourceURL=webpack:///multi_webpack/hot/poll?");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/common\");\n\n//# sourceURL=webpack:///external_%22@nestjs/common%22?");

/***/ }),

/***/ "@nestjs/common/decorators/http":
/*!*************************************************!*\
  !*** external "@nestjs/common/decorators/http" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/common/decorators/http\");\n\n//# sourceURL=webpack:///external_%22@nestjs/common/decorators/http%22?");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/core\");\n\n//# sourceURL=webpack:///external_%22@nestjs/core%22?");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/mongoose\");\n\n//# sourceURL=webpack:///external_%22@nestjs/mongoose%22?");

/***/ }),

/***/ "@nestjs/websockets":
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@nestjs/websockets\");\n\n//# sourceURL=webpack:///external_%22@nestjs/websockets%22?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcrypt\");\n\n//# sourceURL=webpack:///external_%22bcrypt%22?");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"child_process\");\n\n//# sourceURL=webpack:///external_%22child_process%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "fs-extra":
/*!***************************!*\
  !*** external "fs-extra" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs-extra\");\n\n//# sourceURL=webpack:///external_%22fs-extra%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"multer\");\n\n//# sourceURL=webpack:///external_%22multer%22?");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodemailer\");\n\n//# sourceURL=webpack:///external_%22nodemailer%22?");

/***/ }),

/***/ "nodemailer-smtp-pool":
/*!***************************************!*\
  !*** external "nodemailer-smtp-pool" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodemailer-smtp-pool\");\n\n//# sourceURL=webpack:///external_%22nodemailer-smtp-pool%22?");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport\");\n\n//# sourceURL=webpack:///external_%22passport%22?");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-jwt\");\n\n//# sourceURL=webpack:///external_%22passport-jwt%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "pdf2text":
/*!***************************!*\
  !*** external "pdf2text" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"pdf2text\");\n\n//# sourceURL=webpack:///external_%22pdf2text%22?");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"rxjs/operators\");\n\n//# sourceURL=webpack:///external_%22rxjs/operators%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");\n\n//# sourceURL=webpack:///external_%22uuid%22?");

/***/ })

/******/ });