import {
  AbstractUserDataWriter,
  AggregateField,
  AggregateQuerySnapshot,
  ByteString,
  Bytes,
  CollectionReference,
  DatabaseId,
  DocumentKey,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldPath$1,
  FieldValue,
  FirestoreError,
  GeoPoint,
  LoadBundleTask,
  PersistentCacheIndexManager,
  Query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  QueryDocumentSnapshot,
  QueryEndAtConstraint,
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  QueryStartAtConstraint,
  SnapshotMetadata,
  TestingHooks,
  Timestamp,
  Transaction,
  VectorValue,
  WriteBatch,
  __PRIVATE_AutoId,
  __PRIVATE_EmptyAppCheckTokenProvider,
  __PRIVATE_EmptyAuthCredentialsProvider,
  __PRIVATE_cast,
  __PRIVATE_debugAssert,
  __PRIVATE_isBase64Available,
  __PRIVATE_logWarn,
  __PRIVATE_validateIsNotUsedTogether,
  _internalAggregationQueryToProtoRunAggregationQueryRequest,
  _internalQueryToProtoQueryTarget,
  addDoc,
  aggregateFieldEqual,
  aggregateQuerySnapshotEqual,
  and,
  arrayRemove,
  arrayUnion,
  average,
  clearIndexedDbPersistence,
  collection,
  collectionGroup,
  connectFirestoreEmulator,
  count,
  deleteAllPersistentCacheIndexes,
  deleteDoc,
  deleteField,
  disableNetwork,
  disablePersistentCacheIndexAutoCreation,
  doc,
  documentId,
  documentSnapshotFromJSON,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  enableNetwork,
  enablePersistentCacheIndexAutoCreation,
  endAt,
  endBefore,
  ensureFirestoreConfigured,
  executeWrite,
  getAggregateFromServer,
  getCountFromServer,
  getDoc,
  getDocFromCache,
  getDocFromServer,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  getFirestore,
  getPersistentCacheIndexManager,
  increment,
  initializeFirestore,
  limit,
  limitToLast,
  loadBundle,
  memoryEagerGarbageCollector,
  memoryLocalCache,
  memoryLruGarbageCollector,
  namedQuery,
  onSnapshot,
  onSnapshotResume,
  onSnapshotsInSync,
  or,
  orderBy,
  persistentLocalCache,
  persistentMultipleTabManager,
  persistentSingleTabManager,
  query,
  queryEqual,
  querySnapshotFromJSON,
  refEqual,
  runTransaction,
  serverTimestamp,
  setDoc,
  setIndexConfiguration,
  setLogLevel,
  snapshotEqual,
  startAfter,
  startAt,
  sum,
  terminate,
  un,
  updateDoc,
  vector,
  waitForPendingWrites,
  where,
  writeBatch
} from "./chunk-3C4YQ3HF.js";
import {
  AppCheckInstances,
  AuthInstances
} from "./chunk-T2CFBUI3.js";
import "./chunk-UZEY6DZM.js";
import {
  FirebaseApp,
  FirebaseApps,
  VERSION,
  ɵAngularFireSchedulers,
  ɵgetAllInstancesOf,
  ɵgetDefaultInstanceOf,
  ɵzoneWrap
} from "./chunk-PG7VYUTQ.js";
import {
  registerVersion
} from "./chunk-RJK2WKUN.js";
import "./chunk-OKRTAVVY.js";
import "./chunk-2IKRYAR5.js";
import {
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Optional,
  makeEnvironmentProviders,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-SFU4TGYD.js";
import "./chunk-4KH7OR2E.js";
import "./chunk-TQEZG5EA.js";
import {
  Observable,
  concatMap,
  distinct,
  distinctUntilChanged,
  filter,
  from,
  map,
  pairwise,
  pipe,
  scan,
  startWith,
  timer
} from "./chunk-YW3BVAYB.js";
import "./chunk-ZV6BMDTX.js";
import {
  __name,
  __publicField
} from "./chunk-EZOOG32M.js";

// node_modules/rxfire/firestore/index.esm.js
var __assign = /* @__PURE__ */ __name(function() {
  __assign = Object.assign || /* @__PURE__ */ __name(function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  }, "__assign");
  return __assign.apply(this, arguments);
}, "__assign");
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
    if (ar || !(i in from2)) {
      if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
      ar[i] = from2[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
__name(__spreadArray, "__spreadArray");
var DEFAULT_OPTIONS = { includeMetadataChanges: false };
function fromRef(ref, options) {
  if (options === void 0) {
    options = DEFAULT_OPTIONS;
  }
  return new Observable(function(subscriber) {
    var unsubscribe = onSnapshot(ref, options, {
      next: subscriber.next.bind(subscriber),
      error: subscriber.error.bind(subscriber),
      complete: subscriber.complete.bind(subscriber)
    });
    return { unsubscribe };
  });
}
__name(fromRef, "fromRef");
function doc2(ref) {
  return fromRef(ref, { includeMetadataChanges: true });
}
__name(doc2, "doc");
function docData(ref, options) {
  if (options === void 0) {
    options = {};
  }
  return doc2(ref).pipe(map(function(snap) {
    return snapToData(snap, options);
  }));
}
__name(docData, "docData");
function snapToData(snapshot, options) {
  var _a;
  if (options === void 0) {
    options = {};
  }
  var data = snapshot.data(options);
  if (!snapshot.exists() || typeof data !== "object" || data === null || !options.idField) {
    return data;
  }
  return __assign(__assign({}, data), (_a = {}, _a[options.idField] = snapshot.id, _a));
}
__name(snapToData, "snapToData");
var ALL_EVENTS = ["added", "modified", "removed"];
var filterEvents = /* @__PURE__ */ __name(function(events) {
  return filter(function(changes) {
    var hasChange = false;
    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];
      if (events && events.indexOf(change.type) >= 0) {
        hasChange = true;
        break;
      }
    }
    return hasChange;
  });
}, "filterEvents");
function sliceAndSplice(original, start, deleteCount) {
  var args = [];
  for (var _i = 3; _i < arguments.length; _i++) {
    args[_i - 3] = arguments[_i];
  }
  var returnArray = original.slice();
  returnArray.splice.apply(returnArray, __spreadArray([start, deleteCount], args, false));
  return returnArray;
}
__name(sliceAndSplice, "sliceAndSplice");
function processIndividualChange(combined, change) {
  switch (change.type) {
    case "added":
      if (combined[change.newIndex] && refEqual(combined[change.newIndex].doc.ref, change.doc.ref)) ;
      else {
        return sliceAndSplice(combined, change.newIndex, 0, change);
      }
      break;
    case "modified":
      if (combined[change.oldIndex] == null || refEqual(combined[change.oldIndex].doc.ref, change.doc.ref)) {
        if (change.oldIndex !== change.newIndex) {
          var copiedArray = combined.slice();
          copiedArray.splice(change.oldIndex, 1);
          copiedArray.splice(change.newIndex, 0, change);
          return copiedArray;
        } else {
          return sliceAndSplice(combined, change.newIndex, 1, change);
        }
      }
      break;
    case "removed":
      if (combined[change.oldIndex] && refEqual(combined[change.oldIndex].doc.ref, change.doc.ref)) {
        return sliceAndSplice(combined, change.oldIndex, 1);
      }
      break;
  }
  return combined;
}
__name(processIndividualChange, "processIndividualChange");
function processDocumentChanges(current, changes, events) {
  if (events === void 0) {
    events = ALL_EVENTS;
  }
  changes.forEach(function(change) {
    if (events.indexOf(change.type) > -1) {
      current = processIndividualChange(current, change);
    }
  });
  return current;
}
__name(processDocumentChanges, "processDocumentChanges");
var windowwise = /* @__PURE__ */ __name(function() {
  return pipe(startWith(void 0), pairwise());
}, "windowwise");
var metaDataEquals = /* @__PURE__ */ __name(function(a, b) {
  return JSON.stringify(a.metadata) === JSON.stringify(b.metadata);
}, "metaDataEquals");
var filterEmptyUnlessFirst = /* @__PURE__ */ __name(function() {
  return pipe(windowwise(), filter(function(_a) {
    var prior = _a[0], current = _a[1];
    return current.length > 0 || prior === void 0;
  }), map(function(_a) {
    var current = _a[1];
    return current;
  }));
}, "filterEmptyUnlessFirst");
function collectionChanges(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return fromRef(query3, { includeMetadataChanges: true }).pipe(windowwise(), map(function(_a) {
    var priorSnapshot = _a[0], currentSnapshot = _a[1];
    var docChanges = currentSnapshot.docChanges();
    if (priorSnapshot && !metaDataEquals(priorSnapshot, currentSnapshot)) {
      currentSnapshot.docs.forEach(function(currentDocSnapshot, currentIndex) {
        var currentDocChange = docChanges.find(function(c) {
          return refEqual(c.doc.ref, currentDocSnapshot.ref);
        });
        if (currentDocChange) {
          if (metaDataEquals(currentDocChange.doc, currentDocSnapshot)) {
            return;
          }
        } else {
          var priorDocSnapshot = priorSnapshot === null || priorSnapshot === void 0 ? void 0 : priorSnapshot.docs.find(function(d) {
            return refEqual(d.ref, currentDocSnapshot.ref);
          });
          if (priorDocSnapshot && metaDataEquals(priorDocSnapshot, currentDocSnapshot)) {
            return;
          }
        }
        docChanges.push({
          oldIndex: currentIndex,
          newIndex: currentIndex,
          type: "modified",
          doc: currentDocSnapshot
        });
      });
    }
    return docChanges;
  }), filterEvents(options.events || ALL_EVENTS), filterEmptyUnlessFirst());
}
__name(collectionChanges, "collectionChanges");
function collection2(query3) {
  return fromRef(query3, { includeMetadataChanges: true }).pipe(map(function(changes) {
    return changes.docs;
  }));
}
__name(collection2, "collection");
function sortedChanges(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return collectionChanges(query3, options).pipe(scan(function(current, changes) {
    return processDocumentChanges(current, changes, options.events);
  }, []), distinctUntilChanged());
}
__name(sortedChanges, "sortedChanges");
function auditTrail(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return collectionChanges(query3, options).pipe(scan(function(current, action) {
    return __spreadArray(__spreadArray([], current, true), action, true);
  }, []));
}
__name(auditTrail, "auditTrail");
function collectionData(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return collection2(query3).pipe(map(function(arr) {
    return arr.map(function(snap) {
      return snapToData(snap, options);
    });
  }));
}
__name(collectionData, "collectionData");
function collectionCountSnap(query3) {
  return from(getCountFromServer(query3));
}
__name(collectionCountSnap, "collectionCountSnap");
function collectionCount(query3) {
  return collectionCountSnap(query3).pipe(map(function(snap) {
    return snap.data().count;
  }));
}
__name(collectionCount, "collectionCount");

// node_modules/@angular/fire/fesm2022/angular-fire-firestore.mjs
var _Firestore = class _Firestore {
  constructor(firestore) {
    return firestore;
  }
};
__name(_Firestore, "Firestore");
var Firestore = _Firestore;
var FIRESTORE_PROVIDER_NAME = "firestore";
var _FirestoreInstances = class _FirestoreInstances {
  constructor() {
    return ɵgetAllInstancesOf(FIRESTORE_PROVIDER_NAME);
  }
};
__name(_FirestoreInstances, "FirestoreInstances");
var FirestoreInstances = _FirestoreInstances;
var firestoreInstance$ = timer(0, 300).pipe(concatMap(() => from(ɵgetAllInstancesOf(FIRESTORE_PROVIDER_NAME))), distinct());
var PROVIDED_FIRESTORE_INSTANCES = new InjectionToken("angularfire2.firestore-instances");
function defaultFirestoreInstanceFactory(provided, defaultApp) {
  const defaultFirestore = ɵgetDefaultInstanceOf(FIRESTORE_PROVIDER_NAME, provided, defaultApp);
  return defaultFirestore && new Firestore(defaultFirestore);
}
__name(defaultFirestoreInstanceFactory, "defaultFirestoreInstanceFactory");
function firestoreInstanceFactory(fn) {
  return (zone, injector) => {
    const firestore = zone.runOutsideAngular(() => fn(injector));
    return new Firestore(firestore);
  };
}
__name(firestoreInstanceFactory, "firestoreInstanceFactory");
var FIRESTORE_INSTANCES_PROVIDER = {
  provide: FirestoreInstances,
  deps: [[new Optional(), PROVIDED_FIRESTORE_INSTANCES]]
};
var DEFAULT_FIRESTORE_INSTANCE_PROVIDER = {
  provide: Firestore,
  useFactory: defaultFirestoreInstanceFactory,
  deps: [[new Optional(), PROVIDED_FIRESTORE_INSTANCES], FirebaseApp]
};
var _FirestoreModule = class _FirestoreModule {
  constructor() {
    registerVersion("angularfire", VERSION.full, "fst");
  }
};
__name(_FirestoreModule, "FirestoreModule");
__publicField(_FirestoreModule, "ɵfac", /* @__PURE__ */ __name(function FirestoreModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FirestoreModule)();
}, "FirestoreModule_Factory"));
__publicField(_FirestoreModule, "ɵmod", ɵɵdefineNgModule({
  type: _FirestoreModule
}));
__publicField(_FirestoreModule, "ɵinj", ɵɵdefineInjector({
  providers: [DEFAULT_FIRESTORE_INSTANCE_PROVIDER, FIRESTORE_INSTANCES_PROVIDER]
}));
var FirestoreModule = _FirestoreModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FirestoreModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_FIRESTORE_INSTANCE_PROVIDER, FIRESTORE_INSTANCES_PROVIDER]
    }]
  }], () => [], null);
})();
function provideFirestore(fn, ...deps) {
  registerVersion("angularfire", VERSION.full, "fst");
  return makeEnvironmentProviders([DEFAULT_FIRESTORE_INSTANCE_PROVIDER, FIRESTORE_INSTANCES_PROVIDER, {
    provide: PROVIDED_FIRESTORE_INSTANCES,
    useFactory: firestoreInstanceFactory(fn),
    multi: true,
    deps: [
      NgZone,
      Injector,
      ɵAngularFireSchedulers,
      FirebaseApps,
      // Firestore+Auth work better if Auth is loaded first
      [new Optional(), AuthInstances],
      [new Optional(), AppCheckInstances],
      ...deps
    ]
  }]);
}
__name(provideFirestore, "provideFirestore");
var auditTrail2 = ɵzoneWrap(auditTrail, true);
var collectionSnapshots = ɵzoneWrap(collection2, true);
var collectionChanges2 = ɵzoneWrap(collectionChanges, true);
var collectionCount2 = ɵzoneWrap(collectionCount, true);
var collectionCountSnap2 = ɵzoneWrap(collectionCountSnap, true);
var collectionData2 = ɵzoneWrap(collectionData, true);
var docSnapshots = ɵzoneWrap(doc2, true);
var docData2 = ɵzoneWrap(docData, true);
var fromRef2 = ɵzoneWrap(fromRef, true);
var snapToData2 = ɵzoneWrap(snapToData, true);
var sortedChanges2 = ɵzoneWrap(sortedChanges, true);
var addDoc2 = ɵzoneWrap(addDoc, true, 2);
var aggregateFieldEqual2 = ɵzoneWrap(aggregateFieldEqual, true, 2);
var aggregateQuerySnapshotEqual2 = ɵzoneWrap(aggregateQuerySnapshotEqual, true, 2);
var and2 = ɵzoneWrap(and, true, 2);
var clearIndexedDbPersistence2 = ɵzoneWrap(clearIndexedDbPersistence, true);
var collection3 = ɵzoneWrap(collection, true, 2);
var collectionGroup2 = ɵzoneWrap(collectionGroup, true, 2);
var connectFirestoreEmulator2 = ɵzoneWrap(connectFirestoreEmulator, true);
var deleteAllPersistentCacheIndexes2 = ɵzoneWrap(deleteAllPersistentCacheIndexes, true);
var deleteDoc2 = ɵzoneWrap(deleteDoc, true, 2);
var deleteField2 = ɵzoneWrap(deleteField, true, 2);
var disableNetwork2 = ɵzoneWrap(disableNetwork, true);
var disablePersistentCacheIndexAutoCreation2 = ɵzoneWrap(disablePersistentCacheIndexAutoCreation, true);
var doc3 = ɵzoneWrap(doc, true, 2);
var documentId2 = ɵzoneWrap(documentId, true, 2);
var enableIndexedDbPersistence2 = ɵzoneWrap(enableIndexedDbPersistence, true);
var enableMultiTabIndexedDbPersistence2 = ɵzoneWrap(enableMultiTabIndexedDbPersistence, true);
var enableNetwork2 = ɵzoneWrap(enableNetwork, true);
var enablePersistentCacheIndexAutoCreation2 = ɵzoneWrap(enablePersistentCacheIndexAutoCreation, true);
var endAt2 = ɵzoneWrap(endAt, true, 2);
var endBefore2 = ɵzoneWrap(endBefore, true, 2);
var getAggregateFromServer2 = ɵzoneWrap(getAggregateFromServer, true);
var getCountFromServer2 = ɵzoneWrap(getCountFromServer, true);
var getDoc2 = ɵzoneWrap(getDoc, true);
var getDocFromCache2 = ɵzoneWrap(getDocFromCache, true);
var getDocFromServer2 = ɵzoneWrap(getDocFromServer, true);
var getDocs2 = ɵzoneWrap(getDocs, true);
var getDocsFromCache2 = ɵzoneWrap(getDocsFromCache, true);
var getDocsFromServer2 = ɵzoneWrap(getDocsFromServer, true);
var getFirestore2 = ɵzoneWrap(getFirestore, true);
var getPersistentCacheIndexManager2 = ɵzoneWrap(getPersistentCacheIndexManager, true);
var increment2 = ɵzoneWrap(increment, true, 2);
var initializeFirestore2 = ɵzoneWrap(initializeFirestore, true);
var limit2 = ɵzoneWrap(limit, true, 2);
var limitToLast2 = ɵzoneWrap(limitToLast, true, 2);
var loadBundle2 = ɵzoneWrap(loadBundle, true);
var namedQuery2 = ɵzoneWrap(namedQuery, true, 2);
var onSnapshot2 = ɵzoneWrap(onSnapshot, true);
var onSnapshotsInSync2 = ɵzoneWrap(onSnapshotsInSync, true);
var or2 = ɵzoneWrap(or, true, 2);
var orderBy2 = ɵzoneWrap(orderBy, true, 2);
var query2 = ɵzoneWrap(query, true, 2);
var queryEqual2 = ɵzoneWrap(queryEqual, true, 2);
var refEqual2 = ɵzoneWrap(refEqual, true, 2);
var runTransaction2 = ɵzoneWrap(runTransaction, true);
var setDoc2 = ɵzoneWrap(setDoc, true, 2);
var setIndexConfiguration2 = ɵzoneWrap(setIndexConfiguration, true);
var setLogLevel2 = ɵzoneWrap(setLogLevel, true);
var snapshotEqual2 = ɵzoneWrap(snapshotEqual, true, 2);
var startAfter2 = ɵzoneWrap(startAfter, true, 2);
var startAt2 = ɵzoneWrap(startAt, true, 2);
var sum2 = ɵzoneWrap(sum, true, 2);
var terminate2 = ɵzoneWrap(terminate, true);
var updateDoc2 = ɵzoneWrap(updateDoc, true, 2);
var vector2 = ɵzoneWrap(vector, true, 2);
var waitForPendingWrites2 = ɵzoneWrap(waitForPendingWrites, true);
var where2 = ɵzoneWrap(where, true, 2);
var writeBatch2 = ɵzoneWrap(writeBatch, true, 2);
export {
  AbstractUserDataWriter,
  AggregateField,
  AggregateQuerySnapshot,
  Bytes,
  un as CACHE_SIZE_UNLIMITED,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldValue,
  Firestore,
  FirestoreError,
  FirestoreInstances,
  FirestoreModule,
  GeoPoint,
  LoadBundleTask,
  PersistentCacheIndexManager,
  Query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  QueryDocumentSnapshot,
  QueryEndAtConstraint,
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  QueryStartAtConstraint,
  SnapshotMetadata,
  Timestamp,
  Transaction,
  VectorValue,
  WriteBatch,
  __PRIVATE_AutoId as _AutoId,
  ByteString as _ByteString,
  DatabaseId as _DatabaseId,
  DocumentKey as _DocumentKey,
  __PRIVATE_EmptyAppCheckTokenProvider as _EmptyAppCheckTokenProvider,
  __PRIVATE_EmptyAuthCredentialsProvider as _EmptyAuthCredentialsProvider,
  FieldPath$1 as _FieldPath,
  TestingHooks as _TestingHooks,
  __PRIVATE_cast as _cast,
  __PRIVATE_debugAssert as _debugAssert,
  _internalAggregationQueryToProtoRunAggregationQueryRequest,
  _internalQueryToProtoQueryTarget,
  __PRIVATE_isBase64Available as _isBase64Available,
  __PRIVATE_logWarn as _logWarn,
  __PRIVATE_validateIsNotUsedTogether as _validateIsNotUsedTogether,
  addDoc2 as addDoc,
  aggregateFieldEqual2 as aggregateFieldEqual,
  aggregateQuerySnapshotEqual2 as aggregateQuerySnapshotEqual,
  and2 as and,
  arrayRemove,
  arrayUnion,
  auditTrail2 as auditTrail,
  average,
  clearIndexedDbPersistence2 as clearIndexedDbPersistence,
  collection3 as collection,
  collectionChanges2 as collectionChanges,
  collectionCount2 as collectionCount,
  collectionCountSnap2 as collectionCountSnap,
  collectionData2 as collectionData,
  collectionGroup2 as collectionGroup,
  collectionSnapshots,
  connectFirestoreEmulator2 as connectFirestoreEmulator,
  count,
  deleteAllPersistentCacheIndexes2 as deleteAllPersistentCacheIndexes,
  deleteDoc2 as deleteDoc,
  deleteField2 as deleteField,
  disableNetwork2 as disableNetwork,
  disablePersistentCacheIndexAutoCreation2 as disablePersistentCacheIndexAutoCreation,
  doc3 as doc,
  docData2 as docData,
  docSnapshots,
  documentId2 as documentId,
  documentSnapshotFromJSON,
  enableIndexedDbPersistence2 as enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence2 as enableMultiTabIndexedDbPersistence,
  enableNetwork2 as enableNetwork,
  enablePersistentCacheIndexAutoCreation2 as enablePersistentCacheIndexAutoCreation,
  endAt2 as endAt,
  endBefore2 as endBefore,
  ensureFirestoreConfigured,
  executeWrite,
  firestoreInstance$,
  fromRef2 as fromRef,
  getAggregateFromServer2 as getAggregateFromServer,
  getCountFromServer2 as getCountFromServer,
  getDoc2 as getDoc,
  getDocFromCache2 as getDocFromCache,
  getDocFromServer2 as getDocFromServer,
  getDocs2 as getDocs,
  getDocsFromCache2 as getDocsFromCache,
  getDocsFromServer2 as getDocsFromServer,
  getFirestore2 as getFirestore,
  getPersistentCacheIndexManager2 as getPersistentCacheIndexManager,
  increment2 as increment,
  initializeFirestore2 as initializeFirestore,
  limit2 as limit,
  limitToLast2 as limitToLast,
  loadBundle2 as loadBundle,
  memoryEagerGarbageCollector,
  memoryLocalCache,
  memoryLruGarbageCollector,
  namedQuery2 as namedQuery,
  onSnapshot2 as onSnapshot,
  onSnapshotResume,
  onSnapshotsInSync2 as onSnapshotsInSync,
  or2 as or,
  orderBy2 as orderBy,
  persistentLocalCache,
  persistentMultipleTabManager,
  persistentSingleTabManager,
  provideFirestore,
  query2 as query,
  queryEqual2 as queryEqual,
  querySnapshotFromJSON,
  refEqual2 as refEqual,
  runTransaction2 as runTransaction,
  serverTimestamp,
  setDoc2 as setDoc,
  setIndexConfiguration2 as setIndexConfiguration,
  setLogLevel2 as setLogLevel,
  snapToData2 as snapToData,
  snapshotEqual2 as snapshotEqual,
  sortedChanges2 as sortedChanges,
  startAfter2 as startAfter,
  startAt2 as startAt,
  sum2 as sum,
  terminate2 as terminate,
  updateDoc2 as updateDoc,
  vector2 as vector,
  waitForPendingWrites2 as waitForPendingWrites,
  where2 as where,
  writeBatch2 as writeBatch
};
/*! Bundled license information:

rxfire/firestore/index.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=@angular_fire_firestore.js.map
