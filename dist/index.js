"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BooleanStateProperty: () => BooleanStateProperty,
  Condition: () => Condition,
  DEventHandler: () => DEventHandler,
  DState: () => DState,
  Rule: () => Rule,
  RuleEngine: () => RuleEngine,
  SchemaDto: () => SchemaDto,
  SchemaEngine: () => SchemaEngine
});
module.exports = __toCommonJS(src_exports);

// src/dto/SchemaDto.ts
var SchemaDto;
((SchemaDto2) => {
  SchemaDto2.getResources = (schema) => {
    const { pages } = schema;
    const videoList = pages.reduce((acc, curr) => {
      if (Array.isArray(curr.video)) {
        acc.push(...curr.video);
      }
      return acc;
    }, []);
    const audioList = pages.reduce((acc, curr) => {
      if (Array.isArray(curr.audio)) {
        acc.push(...curr.audio);
      }
      return acc;
    }, []);
    return { videoList, audioList, imageList: [] };
  };
})(SchemaDto || (SchemaDto = {}));

// src/common/DTimestamp.ts
var DTimestamp;
((DTimestamp2) => {
  DTimestamp2.now = () => Date.now();
  DTimestamp2.diff = (t1, t2) => {
    const t1Abs = Math.abs(t1);
    const t2Abs = Math.abs(t2);
    return Math.abs(t1Abs - t2Abs);
  };
  DTimestamp2.diffNow = (t) => {
    return (0, DTimestamp2.diff)(t, (0, DTimestamp2.now)());
  };
})(DTimestamp || (DTimestamp = {}));

// src/utils/DUtil.ts
var DUtil;
((DUtil2) => {
  DUtil2.randomString = (length) => {
    const letters = "abcdefghijklmnopqrstuvxyz";
    const uppercase = letters.toUpperCase();
    const all = letters + uppercase;
    const abs = Math.abs(length);
    let result = "";
    for (let i = 0; i < abs; i++) {
      const char = all.charAt(Math.floor(Math.random() * all.length));
      result += char;
    }
    return result;
  };
  DUtil2.isInfinity = (number) => {
    return number === Number.POSITIVE_INFINITY || number === Number.NEGATIVE_INFINITY || number === Infinity;
  };
  DUtil2.isNonEmptyArray = (array) => {
    return array.length > 0;
  };
  DUtil2.neverCheck = (args) => {
    console.log("OOPS: This value slipped through the never-check", args);
  };
  DUtil2.isString = (str) => typeof str === "string";
  DUtil2.hasKey = (obj, key) => {
    if (!(0, DUtil2.isRecord)(obj)) {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  DUtil2.isRecord = (obj) => {
    if (!obj) {
      return false;
    }
    if (Array.isArray(obj)) {
      return false;
    }
    if (typeof obj !== "object") {
      return false;
    }
    if (obj === null) {
      return false;
    }
    return true;
  };
  DUtil2.isBool = (obj) => typeof obj === "boolean";
  DUtil2.isTrue = (bool) => bool === true;
  DUtil2.isFalse = (bool) => bool === false;
  DUtil2.isDefined = (obj) => {
    const notNull = obj !== null;
    const notUndefined = obj !== void 0;
    return notNull && notUndefined;
  };
  DUtil2.hasKind = (obj) => {
    if (!(0, DUtil2.hasKey)(obj, "kind")) {
      return false;
    }
    if (typeof obj.kind !== "string") {
      return false;
    }
    return obj.kind.length > 0;
  };
  DUtil2.hasValue = (obj) => {
    return (0, DUtil2.hasKey)(obj, "value");
  };
  DUtil2.isNumber = (value) => {
    const isNumber2 = typeof value === "number";
    const notNaN = !Number.isNaN(value);
    return isNumber2 && notNaN;
  };
  DUtil2.maxFn = (upperLimit) => {
    return (value) => {
      return Math.min(value, upperLimit);
    };
  };
  DUtil2.minFn = (lowerLimit) => {
    return (value) => {
      return Math.min(value, lowerLimit);
    };
  };
})(DUtil || (DUtil = {}));

// src/Delement/css.ts
var DCss;
((DCss2) => {
  DCss2.toString = (unit, scale) => {
    const clampedScale = Math.max(scale, 0.03);
    if (unit._unit === "px") {
      if (unit.value < 0.1) {
        return "0px";
      }
      const rounded = Math.round(unit.value * clampedScale);
      const clamped = Math.max(rounded, 1);
      return clamped + "px";
    }
    return unit.value + "%";
  };
  DCss2.isLengthUnit = (unit) => {
    if (!unit) {
      return false;
    }
    const unitKey = "_unit";
    const valueKey = "value";
    const hasUnitKey = DUtil.hasKey(unit, unitKey);
    const hasValueKey = DUtil.hasKey(unit, valueKey);
    return hasUnitKey && hasValueKey;
  };
})(DCss || (DCss = {}));

// src/Delement/DStyle.ts
var DStyle;
((DStyle2) => {
  DStyle2.normalize = (el) => {
    el.style.padding = "0";
    el.style.margin = "0";
    el.style.position = "absolute";
    el.style.boxSizing = "border-box";
    return el;
  };
  DStyle2.applyStyles = (el, style, scale) => {
    const {
      x,
      y,
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius,
      borderStyle,
      w,
      opacity,
      cursor,
      fontSize,
      fontWeight,
      textColor,
      textAlign,
      translate,
      margin,
      padding,
      letterSpacing,
      h,
      transform,
      visibility
    } = style;
    if (backgroundColor) {
      el.style.backgroundColor = backgroundColor;
    }
    if (cursor) {
      el.style.cursor = cursor;
    }
    if (transform) {
      el.style.transform = transform;
    }
    if (textColor) {
      el.style.color = textColor;
    }
    if (textAlign) {
      el.style.textAlign = textAlign;
    }
    if (borderColor) {
      el.style.borderColor = borderColor;
    }
    if (borderWidth) {
      el.style.borderWidth = DCss.toString(borderWidth, scale);
    }
    if (fontWeight) {
      el.style.fontWeight = fontWeight + "";
    }
    if (borderStyle) {
      el.style.borderStyle = borderStyle;
    }
    if (fontSize) {
      el.style.fontSize = DCss.toString(fontSize, scale);
    }
    if (DUtil.isNumber(x)) {
      el.style.left = x + "%";
    }
    if (DUtil.isNumber(y)) {
      el.style.bottom = y + "%";
    }
    if (DUtil.isNumber(h)) {
      el.style.height = h + "%";
    }
    if (DUtil.isNumber(w)) {
      el.style.width = w + "%";
    }
    if (DCss.isLengthUnit(borderRadius)) {
      el.style.borderRadius = DCss.toString(borderRadius, scale);
    }
    if (letterSpacing) {
      el.style.letterSpacing = DCss.toString(letterSpacing, scale);
    }
    if (margin) {
      el.style.margin = DCss.toString(margin, scale);
    }
    if (padding) {
      el.style.padding = DCss.toString(padding, scale);
    }
    if (DUtil.isNumber(opacity)) {
      el.style.opacity = opacity + "";
    }
    if (visibility) {
      el.style.visibility = visibility;
    }
    return el;
  };
})(DStyle || (DStyle = {}));

// src/Delement/VideoContainer.ts
var VideoContainer = class {
  constructor(el, eventBus, scale, dto) {
    this.el = el;
    this.eventBus = eventBus;
    this.scale = scale;
    this.TAG = "[ D_Video ] : ";
    this.el.controls = false;
    DStyle.normalize(this.el);
    DStyle.applyStyles(this.el, this.defaultStyles, this.scale.scale);
    this._onReadyToPlay = this._onReadyToPlay.bind(this);
    this._onPlayHandler = this._onPlayHandler.bind(this);
    this._onPauseHandler = this._onPauseHandler.bind(this);
    this._onEndedHandler = this._onEndedHandler.bind(this);
    this.el.onended = this._onEndedHandler;
    this.el.onplay = this._onPlayHandler;
    this.el.onpause = this._onPauseHandler;
    this.el.oncanplay = this._onReadyToPlay;
    if (dto) {
      this.setDto(dto);
    }
    this.el.onloadedmetadata = () => {
      const duration = this.el.duration;
      const isInfinity = DUtil.isInfinity(duration);
      this.eventBus.emit({
        kind: "VIDEO_LOADED_METADATA_EVENT",
        timestamp: DTimestamp.now(),
        producer: "DVideo",
        producerId: this.id,
        data: { duration, isInfinity }
      });
    };
    this.el.ondurationchange = () => {
      const duration = this.el.duration;
      const isInfinity = DUtil.isInfinity(duration);
      this.eventBus.emit({
        kind: "VIDEO_DURATION_CHANGE_EVENT",
        producer: "DVideo",
        producerId: this.id,
        timestamp: DTimestamp.now(),
        data: { duration, isInfinity }
      });
    };
  }
  TAG;
  dto;
  defaultStyles = { h: 45, w: 100, visibility: "hidden", y: 55 };
  pause() {
    this.el.pause();
  }
  async playToEnd() {
    this.el.volume = 1;
    const endedOrErrored = new Promise((resolve) => {
      this.el.addEventListener(
        "ended",
        (_) => {
          resolve(true);
        },
        { once: true }
      );
      this.el.addEventListener(
        "error",
        (_) => {
          resolve(false);
        },
        { once: true }
      );
    });
    try {
      console.log("PLAY");
      await this.el.play();
      await endedOrErrored;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      console.log(this.TAG + " playToEnd() completed! videoId: " + this.dto?.id);
    }
  }
  getStats() {
    const duration = this.el.duration;
    const currentTime = this.el.currentTime;
    const volume = this.el.volume;
    const isConnected = this.el.isConnected;
    const playbackQuality = this.el.getVideoPlaybackQuality();
    const defaultPlaybackRate = this.el.defaultPlaybackRate;
    const paused = this.el.paused;
    const played = this.el.played;
    return {
      duration,
      paused,
      played,
      currentTime,
      volume,
      isConnected,
      playbackQuality,
      defaultPlaybackRate
    };
  }
  setDto(dto) {
    this.dto = dto;
    this.el.volume = 1;
    this.setStyle(dto.style);
    this.el.src = dto.url;
    this.el.load();
  }
  getCurrentDto() {
    return this.dto ?? false;
  }
  setStyle(styles) {
    DStyle.applyStyles(this.el, styles, this.scale.scale);
  }
  _onPlayHandler(_) {
    const producerId = this.dto?.id ?? "DVideo";
    this.eventBus.emit({
      kind: "VIDEO_PLAY_EVENT",
      data: {},
      producer: "DVideo",
      producerId,
      timestamp: DTimestamp.now()
    });
  }
  get id() {
    return this.dto?.id ?? "DVideo";
  }
  _onReadyToPlay(_) {
    console.groupCollapsed(this.TAG + "READY TO PLAY");
    console.log("Duration: " + this.el.duration);
    console.log("Id: " + this.id);
    console.log("Current Time: " + this.el.currentTime);
    console.log("AudoPlay: " + this.el.autoplay);
    console.groupEnd();
  }
  _onPauseHandler(_) {
    this.eventBus.emit({
      kind: "VIDEO_PAUSED_EVENT",
      data: {},
      producer: "DVideo",
      producerId: this.id,
      timestamp: DTimestamp.now()
    });
  }
  _onErrorHandler(ev) {
    this.eventBus.emit({
      kind: "VIDEO_ERROR_EVENT",
      timestamp: DTimestamp.now(),
      producer: "DVideo",
      producerId: this.id,
      data: { error: ev }
    });
  }
  _onEndedHandler(_) {
    this.eventBus.emit({
      kind: "VIDEO_ENDED_EVENT",
      timestamp: DTimestamp.now(),
      producer: "DVideo",
      producerId: this.id,
      data: {}
    });
  }
};

// src/event-handlers/DEventHandler.ts
var DEventHandler;
((DEventHandler2) => {
  DEventHandler2.createLookUp = (handlers) => {
    const map = /* @__PURE__ */ new Map();
    handlers?.forEach((h) => {
      const kind = h.onEvent;
      const current = map.get(kind);
      const actions = current ? [...current, h] : [h];
      map.set(kind, actions);
    });
    return map;
  };
})(DEventHandler || (DEventHandler = {}));

// src/Delement/AudioContainer.ts
var AudioContainer = class {
  constructor(element, eventBus, commandBus, dto) {
    this.eventBus = eventBus;
    this.commandBus = commandBus;
    this.el = element;
    this.el.style.position = "absolute";
    this.el.style.visibility = "hidden";
    if (dto) {
      this.setAudio(dto);
    }
    this.onLoad = this.onLoad.bind(this);
    this.el.onload = this.onLoad;
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
    this.el.onloadedmetadata = this.onLoadedMetadata;
    this.onEnded = this.onEnded.bind(this);
    this.el.onended = this.onEnded;
    this.onPlay = this.onPlay.bind(this);
    this.el.onplay = this.onPlay;
    this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
    this.el.oncanplaythrough = this.onCanPlayThrough;
    this.onEnded = this.onEnded.bind(this);
    this.el.onended = this.onEnded;
    this.el.ondurationchange = (_) => {
      const duration = this.el.duration;
      const isInfinity = duration === Number.POSITIVE_INFINITY;
      this.eventBus.emit({
        kind: "AUDIO_DURATION_CHANGE_EVENT",
        timestamp: DTimestamp.now(),
        producer: "DAudio",
        producerId: this.id,
        data: { duration: this.el.duration, isInfinity }
      });
    };
  }
  TAG = "[ DAudio]";
  dto = null;
  el;
  subs = [];
  setAudio(dto) {
    this.subs.forEach((unsubscribe) => {
      unsubscribe();
    });
    const sub = this.eventBus.subscribe((ev) => {
      this.handleEvent(ev);
    });
    this.subs.push(sub);
    this.dto = dto;
    this.el.src = dto.url;
    this.el.load();
  }
  handleEvent(ev) {
    const handlers = this.dto?.eventHandlers;
    const id = this.dto?.id;
    if (!handlers) {
      return false;
    }
    const lookUp = DEventHandler.createLookUp(handlers);
    const allHandlers = lookUp.get(ev.kind) ?? [];
    allHandlers.forEach((h) => {
      const pId = h.when?.producerId;
      const thisId = this.dto?.id;
      console.log(pId, thisId);
      if (pId && thisId && pId === thisId) {
        const commands = h.thenExecute;
        commands.forEach((c) => {
          this.commandBus.emit(c);
        });
      }
    });
    return true;
  }
  onLoadedMetadata(_) {
    this.eventBus.emit({
      kind: "AUDIO_METADATA_LOADED_EVENT",
      timestamp: DTimestamp.now(),
      producer: "DAudio",
      producerId: this.id,
      data: {}
    });
  }
  onLoad(_) {
    this.eventBus.emit({
      kind: "AUDIO_LOAD_EVENT",
      timestamp: DTimestamp.now(),
      producer: "DAudio",
      producerId: this.id,
      data: {}
    });
  }
  get id() {
    return this.dto?.id ?? "DAudio";
  }
  onEnded(_) {
    this.eventBus.emit({
      kind: "AUDIO_ENDED_EVENT",
      data: {},
      producer: "DAudio",
      timestamp: DTimestamp.now(),
      producerId: this.id
    });
  }
  onCanPlayThrough(_) {
    this.eventBus.emit({
      kind: "AUDIO_CAN_PLAY_THROUGH_EVENT",
      data: {},
      producer: "DAudio",
      timestamp: DTimestamp.now(),
      producerId: this.id
    });
  }
  onPlay(_) {
    this.eventBus.emit({
      kind: "AUDIO_PLAY_EVENT",
      producerId: this.id,
      data: {},
      producer: "DAudio",
      timestamp: DTimestamp.now()
    });
  }
  async playToEnd() {
    const endedOrErrored = new Promise((resolve) => {
      this.el.addEventListener(
        "ended",
        (_) => {
          resolve(true);
        },
        { once: true }
      );
      this.el.addEventListener(
        "error",
        (_) => {
          resolve(false);
        },
        { once: true }
      );
    });
    try {
      await this.el.play();
      await endedOrErrored;
      return true;
    } catch (e) {
      this.eventBus.emit({
        kind: "AUDIO_ERROR_EVENT",
        timestamp: DTimestamp.now(),
        producer: "DAudio",
        producerId: this.id,
        data: { error: e }
      });
      return false;
    } finally {
    }
    return Promise.resolve(false);
  }
};

// src/services/DMedia-manager.ts
var DMediaManager = class {
  constructor(hostEl, commandBus, eventBus, resourceProvider, scale) {
    this.hostEl = hostEl;
    this.commandBus = commandBus;
    this.eventBus = eventBus;
    this.resourceProvider = resourceProvider;
    this.scale = scale;
    const videoEl = document.createElement("video");
    const audioEl = document.createElement("audio");
    this.hostEl.append(videoEl);
    this.videoContainer = new VideoContainer(videoEl, eventBus, this.scale);
    this.audioContainer = new AudioContainer(audioEl, this.eventBus, this.commandBus);
    this.tick = this.tick.bind(this);
    this.videoContainer.setStyle({ visibility: "hidden" });
    const now = DTimestamp.now();
    this.pageEnter = now;
    this.sincePageEnter = DTimestamp.diff(now, now);
    this.commandBus.subscribe((action) => {
      this.commandHandler(action);
    });
  }
  TAG = "[ D_MEDIA_MANAGER ] : ";
  videoContainer;
  audioContainer;
  // private sequence: Array<AutoPlayElement> = [];
  pageEnter;
  sincePageEnter;
  currentPage = null;
  setPage(page) {
    this.currentPage = page;
    this.pageEnter = DTimestamp.now();
    const seq = page.autoPlaySequence;
    const { mainVideoId, audio } = page;
    const audioElements = page.audio;
    if (mainVideoId) {
      const dto = this.resourceProvider.getVideoById(mainVideoId);
      if (dto) {
        this.videoContainer.setDto(dto);
        this.videoContainer.setStyle({ ...dto.style, visibility: "visible" });
      }
    } else {
      this.videoContainer.setStyle({ visibility: "hidden" });
    }
    if (audioElements) {
      const first = audioElements[0];
      if (first) {
        this.audioContainer.setAudio(first);
      }
    }
    if (seq) {
      this.playSequence(seq);
    }
  }
  showVideo() {
  }
  commandHandler(command) {
    if (command.kind === "VIDEO_PLAY_COMMAND") {
      const video = command.targetId;
      const dto = this.videoContainer.getCurrentDto();
      if (dto && dto.id === command.targetId) {
        console.log(video);
        this.videoContainer.playToEnd().then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
      }
    }
    if (command.kind === "VIDEO_PAUSE_COMMAND") {
      this.videoContainer.pause();
    }
    if (command.kind === "AUDIO_PLAY_COMMAND") {
      this.audioContainer.playToEnd().then(() => {
      }).catch().finally(() => {
      });
    }
    if (command.kind === "AUDIO_PAUSE_COMMAND") {
    }
  }
  async playSequence(seq) {
    console.log(this.TAG + "SEQUENCE STARTED -- TODO EVENT FOR THIS??");
    const elements = seq.items;
    if (elements.length === 0) {
      return false;
    }
    seq.startCommands.forEach((c) => {
      this.commandBus.emit(c);
    });
    for (let i = 0; i < elements.length; i++) {
      const item = elements[i];
      if (item.kind === "autoplay-video") {
        const dto = this.resourceProvider.getVideoById(item.videoId);
        if (dto)
          this.videoContainer.setDto(dto);
        console.log("DE");
        await this.videoContainer.playToEnd();
      }
      if (item.kind === "autoplay-audio") {
        console.log(item);
        const dto = this.resourceProvider.getAudioById(item.audioId);
        if (dto)
          this.audioContainer.setAudio(dto);
        await this.audioContainer.playToEnd();
      }
    }
    seq.endCommands.forEach((c) => {
      this.commandBus.emit(c);
    });
    console.log(this.TAG + "SEQUENCE ENDED");
    return true;
  }
  // setPage()
  tick() {
  }
};

// src/commands/DCommandBus.ts
var DCommandBus = class {
  TAG = "[ COMMAND_BUS ] ";
  logCommands = false;
  commandLog = [];
  subscribers = /* @__PURE__ */ new Set();
  // readonly sub
  subscribe(cb) {
    this.subscribers.add(cb);
    return () => {
      this.subscribers.delete(cb);
    };
  }
  emit(command) {
    const timestamp = DTimestamp.now();
    this.commandLog.push({ ...command, timestamp });
    if (this.logCommands) {
      this.logCommand(command);
    }
    this.subscribers.forEach((cb) => {
      cb(command);
    });
  }
  logCommand(command) {
    console.groupCollapsed(this.TAG + " " + command.kind);
    console.log("TargetID : " + command.targetId);
    console.log(command.payload);
    console.groupEnd();
  }
  dumpCommandLog() {
    console.group(this.TAG + "LOGG");
    console.table(this.commandLog);
    console.groupEnd();
  }
};

// src/events/event-bus.ts
var EventBus = class {
  TAG = "[  EVENT_BUS  ] ";
  subscribers = /* @__PURE__ */ new Set();
  /**
   * Emit on module end.
   * @private
   */
  eventLog = [];
  consoleLogEvents = false;
  // readonly sub
  subscribe(cb) {
    this.subscribers.add(cb);
    return () => {
      this.subscribers.delete(cb);
    };
  }
  query() {
    return false;
  }
  emit(event) {
    if (this.consoleLogEvents) {
      this.logEvent(event);
    }
    this.eventLog.push(event);
    this.subscribers.forEach((cb) => {
      cb(event);
    });
  }
  logEvent(event) {
    console.groupCollapsed(this.TAG + " " + event.kind);
    console.log("ProducerId: " + event.producerId);
    console.log(event.data);
    console.groupEnd();
  }
  logEvents() {
    console.group(this.TAG + "LOGG");
    console.table(this.eventLog);
    console.groupEnd();
  }
};

// src/player/history-que.ts
var AnsweredQuestion;
((AnsweredQuestion3) => {
  AnsweredQuestion3.eq = (a, b) => {
    return a.fact === b.fact;
  };
})(AnsweredQuestion || (AnsweredQuestion = {}));
var HistoryQue = class {
  history = [];
  getFacts() {
    const answers = this.history.map((h) => h.answeredQuestions).flat(1);
    const facts = answers.map((a) => a.fact);
    return facts;
  }
  getAnswers() {
    const answers = this.history.map((h) => h.answeredQuestions).flat(1);
    return answers;
  }
  addToHistory(page) {
    this.history.push(page);
  }
};

// src/rules/condition.ts
var Condition;
((Condition2) => {
  Condition2.evaluate = (condition, facts) => {
    let result = false;
    switch (condition.kind) {
      case "string-condition":
        result = evaluateSimple(condition, facts);
        break;
      case "numeric-condition":
        result = evaluateSimple(condition, facts);
        break;
      case "complex-condition":
        result = evaluateComplex(condition, facts);
        break;
      default:
        const check = condition;
    }
    return result;
  };
  const evaluateComplex = (condition, facts) => {
    if (condition.some.length === 0 && condition.all.length === 0) {
      return false;
    }
    const allSolved = condition.all.map((condition2) => {
      return evaluateSimple(condition2, facts);
    });
    const someEvaluated = condition.some.map((condition2) => {
      return evaluateSimple(condition2, facts);
    });
    const allResult = allSolved.every(DUtil.isTrue);
    const someResult = someEvaluated.length === 0 || someEvaluated.some(DUtil.isTrue);
    return someResult && allResult;
  };
  const evaluateSimple = (condition, facts) => {
    const fact = facts.find((f) => f.referenceId === condition.referenceId);
    if (!fact) {
      return false;
    }
    let res = false;
    switch (condition.kind) {
      case "numeric-condition":
        if (fact.kind === "numeric-fact") {
          res = evaluateNumeric(condition, fact.value);
        }
        break;
      case "string-condition":
        if (fact.kind === "string-fact") {
          res = evaluateString(condition, fact.value);
        }
        break;
      default:
        const check = condition;
    }
    return res;
  };
  Condition2.isEmpty = (complex) => {
    return complex.all.length === 0 && complex.some.length === 0;
  };
  const evaluateString = (condition, value) => {
    const operator = condition.operator;
    let result = false;
    switch (operator) {
      case "eq":
        result = condition.value === value;
        break;
      case "not-eq":
        result = condition.value !== value;
        break;
      case "shorter-then":
        result = condition.value !== value;
        break;
      case "longer-then":
        result = condition.value !== value;
        break;
      default:
        const check = operator;
    }
    return result;
  };
  const evaluateNumeric = (condition, value) => {
    const op = condition.operator;
    const conditionValue = condition.value;
    let result = false;
    switch (op) {
      case "eq":
        result = value === conditionValue;
        break;
      case "not-eq":
        result = value !== conditionValue;
        break;
      case "greater-then":
        result = value > conditionValue;
        break;
      case "greater-then-inclusive":
        result = value >= conditionValue;
        break;
      case "less-then":
        result = value < conditionValue;
        break;
      case "less-then-inclusive":
        result = value <= conditionValue;
        break;
      default:
        const check = op;
    }
    return result;
  };
  const _getAllSimple = (condition) => {
    const simple = [];
    switch (condition.kind) {
      case "complex-condition":
        simple.push(...condition.all);
        simple.push(...condition.some);
        break;
      case "numeric-condition":
        simple.push(condition);
        break;
      case "string-condition":
        simple.push(condition);
        break;
      default:
        DUtil.neverCheck(condition);
    }
    return simple;
  };
  Condition2.getAllSimpleConditions = (condition) => {
    const simple = [];
    if (Array.isArray(condition)) {
      condition.forEach((c) => {
        simple.push(..._getAllSimple(c));
      });
    } else {
      simple.push(..._getAllSimple(condition));
    }
    return simple;
  };
})(Condition || (Condition = {}));

// src/rules/rule.ts
var Rule;
((Rule2) => {
  Rule2.isEmpty = (rule) => {
    const emptyConditions = rule.all.length === 0 && rule.some.length === 0;
    const emptyActions = rule.onSuccess.length === 0 && rule.onFailure.length === 0;
    return emptyConditions || emptyActions;
  };
  Rule2.solve = (rule, facts) => {
    if (rule.some.length === 0 && rule.all.length === 0) {
      return false;
    }
    const someSolved = rule.some.map((condition) => Condition.evaluate(condition, facts));
    const someResult = someSolved.length === 0 || someSolved.some(DUtil.isTrue);
    const allSolved = rule.all.map((condition) => Condition.evaluate(condition, facts)).every(DUtil.isTrue);
    return allSolved && someResult;
  };
})(Rule || (Rule = {}));

// src/rules/rule-engine.ts
var RuleEngine = class {
  constructor() {
  }
  solveAll(rules, facts) {
    const errors = [];
    const matching = [];
    rules.forEach((rule) => {
      if (Rule.isEmpty(rule)) {
        errors.push({ message: "Empty rule: " + rule.id });
      } else if (Rule.solve(rule, facts)) {
        const match = {
          ruleDescription: rule.description,
          matchingRuleId: rule.id,
          actionList: [...rule.onSuccess]
        };
        matching.push(match);
      }
    });
    return { matching, errors };
  }
  solve(rule, facts) {
    return Rule.solve(rule, facts);
  }
};

// src/player/next-que.ts
var NextQue = class {
  originalOrder = [];
  allPages = [];
  excludedTags = /* @__PURE__ */ new Set();
  excludedByPageId = /* @__PURE__ */ new Set();
  remaining = [];
  constructor(pages = []) {
    this.resetQue(pages);
  }
  /**
   * Will reset que with the new pages.
   * @param pages
   */
  resetQue(pages) {
    this.allPages = [...pages];
    this.remaining = [...pages];
    this.excludedTags = /* @__PURE__ */ new Set();
    this.excludedByPageId = /* @__PURE__ */ new Set();
    this.originalOrder = this.allPages.map((p) => p.id);
  }
  pop() {
    const next = this.remaining.shift();
    return next ?? false;
  }
  peek() {
    const next = this.remaining[0];
    return next ?? false;
  }
  jumpToPageById(pageId) {
    const index = this.remaining.findIndex((p) => p.id === pageId);
    if (index < 0) {
      return false;
    }
    this.remaining = this.remaining.slice(index);
    return true;
  }
  removeByTag(tag) {
    if (Array.isArray(tag)) {
      tag.forEach((tag2) => {
        this.excludedTags.add(tag2);
      });
    } else {
      this.excludedTags.add(tag);
    }
    this.filterRemaining();
  }
  /**
   * Will not be included
   * @param pages
   */
  insertAsNextByForce(pages) {
    this.remaining.unshift(...pages);
  }
  removeByPageId(pageId) {
    if (Array.isArray(pageId)) {
      pageId.forEach((id) => {
        this.excludedByPageId.add(id);
      });
    } else {
      this.excludedByPageId.add(pageId);
    }
    this.filterRemaining();
  }
  filterRemaining() {
    this.remaining = this.remaining.filter((p) => {
      const tags = p.tags ?? [];
      const isIncluededByTag = !tags.some((tag) => this.excludedTags.has(tag));
      const isIncludedByPageId = !this.excludedByPageId.has(p.id);
      return isIncludedByPageId && isIncluededByTag;
    });
  }
  get isEmpty() {
    return this.remaining.length === 0;
  }
  get size() {
    return this.remaining.length;
  }
  get pageCount() {
    return this.originalOrder.length;
  }
};

// src/player/dplayer.ts
var DPlayer = class {
  history = new HistoryQue();
  ruleEngine = new RuleEngine();
  nextQue = new NextQue();
  data;
  constructor(data) {
    this.data = data;
    this.nextQue.resetQue(data.pages);
  }
  saveHistory(pageHistory) {
    this.history.addToHistory(pageHistory);
  }
  getResults() {
    return this.history.getAnswers();
  }
  // reset(data: PageDto[]) {
  //   this.nextQue.resetQue(pages);
  // }
  goToPageById(pageId) {
    this.nextQue.jumpToPageById(pageId);
  }
  handleNavigationCommand(command) {
    switch (command.kind) {
      case "PAGE_QUE_NEXT_PAGE_COMMAND":
        break;
      case "PAGE_QUE_GO_TO_PAGE_COMMAND":
        this.goToPageById(command.payload.pageId);
        break;
      case "PAGE_QUE_GO_TO_SEQUENCE_COMMAND":
        this.insertSequenceById(command.payload.sequenceId);
        break;
      default:
        DUtil.neverCheck(command);
    }
  }
  getNextPage() {
    return this.nextQue.pop();
  }
  insertSequenceById(id) {
    const seq = this.data.pageSequences?.find((s) => s.id === id);
    if (seq) {
      this.nextQue.insertAsNextByForce([...seq.pages]);
    } else {
    }
  }
  /**
   * Total number of pages.
   */
  get pageCount() {
    return this.nextQue.pageCount;
  }
};

// src/Delement/ID.ts
var ID;
((ID2) => {
  ID2.pageId = () => {
    return createId();
  };
  ID2.elementId = () => {
    return createId();
  };
  const createId = () => {
    return DUtil.randomString(50);
  };
})(ID || (ID = {}));

// src/Delement/DElement.ts
var DElement = class {
  el;
  clickHandlerIsEnabled = true;
  id;
  isAnimatingSelf = false;
  currStyle = {
    fontSize: { _unit: "px", value: 100 },
    fontWeight: 500,
    textColor: "black",
    opacity: 1
  };
  // private readonly onQueryChangedHandlers =
  eventHandlers;
  commandBud;
  eventBus;
  scale;
  baseDto;
  constructor(el, eventBus, commandBus, dto, scale) {
    this.el = el;
    this.id = dto.id;
    this.baseDto = dto;
    this.commandBud = commandBus;
    this.eventBus = eventBus;
    this.eventHandlers = DEventHandler.createLookUp(dto.eventHandlers);
    this.scale = scale;
    this.onClickHandler = this.onClickHandler.bind(this);
    this.el.onclick = this.onClickHandler;
    this.onContextMenuClick = this.onContextMenuClick.bind(this);
    this.el.oncontextmenu = this.onContextMenuClick;
    this.onMouseOver = this.onMouseOver.bind(this);
    this.el.onmouseover = this.onMouseOver;
    if (dto) {
      this.updateStyles(dto?.style);
    }
    this.eventBus.subscribe((event) => {
      const handlers = this.eventHandlers.get(event.kind) ?? [];
      const commands = handlers.map((h) => h.thenExecute).flat(1);
      commands.forEach((command) => {
        this.doAction(command);
      });
      if (event.kind === "HOST_SCALE_CHANGED_EVENT") {
        console.log("HANDLE THIS SCALE CHANGE!!");
        this.updateStyles({});
      }
      if (event.kind === "STATE_QUERY_RESULT_CHANGED_EVENT") {
        this.queryChangedHandler(event.data);
      }
    });
    this.normalize();
  }
  // abstract setScale(scale: number): void;
  doAction(command) {
    switch (command.kind) {
      case "ELEMENT_STYLE_COMMAND":
        this.updateStyles(command.payload.changes);
        break;
      case "ELEMENT_ANIMATE_COMMAND":
        this.handleAnimateSelfAction(command.payload);
        break;
      case "ELEMENT_ENABLE_CLICK_COMMAND":
        this.clickHandlerIsEnabled = true;
        break;
      case "ELEMENT_DISABLE_CLICK_COMMAND":
        this.clickHandlerIsEnabled = false;
        break;
      case "VIDEO_PLAY_COMMAND":
        this.commandBud.emit(command);
        break;
      case "VIDEO_PAUSE_COMMAND":
        this.commandBud.emit(command);
        break;
      case "ENGINE_LEAVE_PAGE_COMMAND":
        this.commandBud.emit(command);
        break;
      case "VIDEO_JUMP_TO_COMMAND":
        this.commandBud.emit(command);
        break;
      case "VIDEO_SET_VOLUME_COMMAND":
        this.commandBud.emit(command);
        break;
      case "AUDIO_PLAY_COMMAND":
        this.commandBud.emit(command);
        break;
      case "AUDIO_PAUSE_COMMAND":
        this.commandBud.emit(command);
        break;
      case "AUDIO_SET_VOLUME_COMMAND":
        this.commandBud.emit(command);
        break;
      case "PAGE_QUE_NEXT_PAGE_COMMAND":
        this.commandBud.emit(command);
        break;
      case "PAGE_QUE_GO_TO_SEQUENCE_COMMAND":
        this.commandBud.emit(command);
        break;
      case "PAGE_QUE_GO_TO_PAGE_COMMAND":
        this.commandBud.emit(command);
        break;
      case "PAGE_QUE_EXCLUDE_BY_PAGE_ID_COMMAND":
        this.commandBud.emit(command);
        break;
      case "PAGE_QUE_JUMP_TO_PAGE_COMMAND":
        this.commandBud.emit(command);
        break;
      case "PAGE_QUE_EXCLUDE_BY_TAG_COMMAND":
        this.commandBud.emit(command);
        break;
      case "STATE_MUTATE_COMMAND":
        this.commandBud.emit(command);
        break;
      default:
        DUtil.neverCheck(command);
    }
  }
  queryChangedHandler(result) {
    const maybeHandlers = this.baseDto.onStateChange;
    if (!maybeHandlers) {
      return;
    }
    const queryHandlers = maybeHandlers.filter((h) => h.queryName === result.queryName);
    queryHandlers.forEach((h) => {
      if (result.curr) {
        h.whenTrue.forEach((command) => {
          this.doAction(command);
        });
      } else {
        h.whenFalse.forEach((command) => {
          this.doAction(command);
        });
      }
    });
  }
  onClickHandler(_) {
    if (!this.clickHandlerIsEnabled) {
      console.log(this.id + "Click disabled");
      return;
    }
    const clickAction = this.baseDto.onClick;
    if (clickAction && clickAction.length > 0) {
      this.eventBus.emit({
        kind: "USER_CLICKED_EVENT",
        producer: "DUser",
        producerId: this.id,
        data: { elementId: this.id },
        timestamp: DTimestamp.now()
      });
      clickAction.forEach((command) => {
        this.commandBud.emit(command);
      });
    }
  }
  onContextMenuClick(_) {
  }
  onMouseOver(_) {
  }
  setStyle(style) {
    this.updateStyles(style);
  }
  appendYourself(parent) {
    parent.append(this.el);
  }
  handleAnimateSelfAction(dto) {
    this.isAnimatingSelf = true;
    const { keyframes, options } = dto;
    const animation = this.el.animate(keyframes, options.duration);
    animation.onfinish = (e) => {
      console.log(e.type);
      this.isAnimatingSelf = false;
    };
    animation.onremove = () => {
      console.warn("ANIMATION REMOVED: " + animation.id);
      this.isAnimatingSelf = false;
    };
    animation.oncancel = () => {
      console.warn("ANIMATION CANCELED: " + animation.id);
      this.isAnimatingSelf = false;
    };
  }
  normalize() {
    DStyle.normalize(this.el);
  }
  updateStyles(style) {
    this.currStyle = Object.assign(this.currStyle, style);
    DStyle.applyStyles(this.el, this.currStyle, this.scale.scale);
    window.getComputedStyle(this.el);
  }
};

// src/Delement/Ddiv.ts
var DDiv = class extends DElement {
  TAG = "[ DDiv ]: ";
  defaultStyle = { x: 22, y: 4 };
  children = [];
  constructor(dto, eventBus, actionService, scale, children) {
    const d = document.createElement("div");
    super(d, eventBus, actionService, dto, scale);
    this.children = children;
    this.children.forEach((child) => {
      child.appendYourself(this.el);
    });
  }
};

// src/Delement/DImg.ts
var _DImg = class extends DElement {
  constructor(dto, actionSubject, eventBus, scaleService) {
    super(document.createElement("img"), eventBus, actionSubject, dto, scaleService);
    this.dto = dto;
    this.actionSubject = actionSubject;
    this.eventBus = eventBus;
    this.scaleService = scaleService;
    _DImg.IMAGE_COUNT += 1;
    this.imageCount = _DImg.IMAGE_COUNT;
    this.TAG = "[D_IMG " + _DImg.IMAGE_COUNT + " ]: ";
    this.TIMING_TAG = "load-time (" + _DImg.IMAGE_COUNT + ") ";
    this.el.loading = "eager";
    this.el.style.position = "absolute";
    this.setStyle(dto.style);
    this.loadStart = DTimestamp.now();
    this.onError = this.onError.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.el.onload = this.onLoad;
    this.el.onerror = this.onError;
    this.el.src = dto.url;
    console.time(this.TIMING_TAG);
  }
  imageCount;
  TAG;
  TIMING_TAG;
  loadStart;
  log() {
  }
  setScale(scale) {
    console.log(scale);
    this.setStyle(this.currStyle);
  }
  onError(ev) {
    if (ev instanceof Event) {
      console.log(this.TAG + " " + ev.type);
    } else {
      console.log(this.TAG + ev);
    }
  }
  onLoad(_) {
    const loadTime = DTimestamp.diffNow(this.loadStart);
    this.eventBus.emit({
      kind: "IMAGE_LOADED_EVENT",
      producer: "DImage",
      producerId: this.id,
      timestamp: DTimestamp.now(),
      data: {
        loadTime,
        naturalHeight: this.el.naturalHeight,
        naturalWidth: this.el.naturalWidth,
        height: this.el.height,
        width: this.el.width
      }
    });
  }
};
var DImg = _DImg;
__publicField(DImg, "IMAGE_COUNT", 0);

// src/Delement/DText.ts
var DText = class extends DElement {
  TAG = "[ DParagraph ]: ";
  defaultStyle = {};
  constructor(dto, eventBus, actionService, scale) {
    super(document.createElement("p"), eventBus, actionService, dto, scale);
    this.el.style.position = "absolute";
    this.el.innerText = "" + dto.text;
    this.setStyle(dto.style);
  }
  setScale(scale) {
    this.setStyle(this.currStyle);
    const fontSize = this.el.style.fontSize;
    console.log(this.TAG + "scale: " + scale + " Fontsize: " + fontSize);
  }
};

// src/engine/element-factory.ts
var createDElement = (dto, actionBus, eventBus, scale) => {
  switch (dto._tag) {
    case "div":
      const childEls = createChildrenForDiv(dto, actionBus, eventBus, scale);
      const newDiv = new DDiv(dto, eventBus, actionBus, scale, childEls);
      return newDiv;
    case "img":
      return new DImg(dto, actionBus, eventBus, scale);
    case "p":
      return new DText(dto, eventBus, actionBus, scale);
    default:
      const check = dto;
      throw new Error("Unknown dto given to the createDElement function.");
  }
};
var createChildrenForDiv = (dto, actionSubject, eventBus, scale) => {
  const childDto = dto.children;
  const childEls = [];
  childDto.forEach((dto2) => {
    if (dto2._tag === "p") {
      const newText = new DText(dto2, eventBus, actionSubject, scale);
      childEls.push(newText);
    }
    if (dto2._tag === "img") {
      const newImage = new DImg(dto2, actionSubject, eventBus, scale);
      childEls.push(newImage);
    }
  });
  return childEls;
};

// src/engine/DPage.ts
var DPage = class {
  // Todo GLOBAL EVENT_BUSS AND PAGE EVENTS:
  constructor(dto, eventBus, commandBus, scale) {
    this.dto = dto;
    this.eventBus = eventBus;
    this.commandBus = commandBus;
    this.scale = scale;
    this.elements = dto.elements.map((dto2) => createDElement(dto2, this.commandBus, this.eventBus, this.scale));
  }
  TAG = "[ DPage ]: ";
  elements = [];
  eventBus;
  commandBus;
  scale;
  appendYourself(parent, preloadMode = false) {
    console.log("APPENDING PAGE");
    this.elements.forEach((el) => {
      el.appendYourself(parent);
    });
    if (!preloadMode) {
      this.eventBus.emit({
        kind: "PAGE_ENTER_EVENT",
        timestamp: DTimestamp.now(),
        producer: "DPage",
        producerId: this.id,
        data: { pageId: this.id }
      });
    }
  }
  log() {
  }
  get id() {
    return this.dto.id;
  }
};

// src/engine/scale.ts
var ScaleService = class {
  baseHeight;
  baseWidth;
  containerHeight = 1300;
  containerWidth = 1300;
  get scale() {
    return this._scale;
  }
  get pageHeight() {
    return this.baseHeight * this.scale;
  }
  get pageWidth() {
    return this.baseWidth * this._scale;
  }
  _scale = 1;
  subscribers = /* @__PURE__ */ new Set();
  constructor(config) {
    this.baseHeight = config.baseHeight;
    this.baseWidth = config.baseWidth;
    this.containerHeight = config.containerHeight;
    this.containerWidth = config.containerWidth;
    this.updateScale();
  }
  setContainerBounds(bounds) {
    this.containerWidth = bounds.width;
    this.containerHeight = bounds.height;
    this.updateScale();
  }
  updateScale() {
    const scaleFn = Scale.calc(this.baseHeight, this.baseWidth);
    const scale = scaleFn({ height: this.containerHeight, width: this.containerWidth });
    const hasChanged = this.scale !== scale;
    this._scale = scale;
    if (hasChanged) {
      this.subscribers.forEach((fn) => {
        fn(this._scale);
      });
    }
  }
  onChange(scaleChangeHandler) {
    this.subscribers.add(scaleChangeHandler);
    scaleChangeHandler(this._scale);
    return () => {
      this.subscribers.delete(scaleChangeHandler);
    };
  }
};
var Scale;
((Scale2) => {
  Scale2.calc = (baseHeight, baseWidth) => {
    return (container) => {
      const heightRatio = container.height / baseHeight;
      const widthRatio = container.width / baseWidth;
      return Math.min(heightRatio, widthRatio);
    };
  };
  Scale2.scaleFunctionCreator = (scale) => {
    return (value) => value * scale;
  };
})(Scale || (Scale = {}));

// src/services/resource-provider.ts
var ResourceProvider = class {
  TAG = "[ RESOURCE_PROVIDER ]: ";
  videoMap = /* @__PURE__ */ new Map();
  audioMap = /* @__PURE__ */ new Map();
  constructor(data) {
    data.videos.forEach((video) => {
      this.videoMap.set(video.id, video);
    });
    data.audio.forEach((audio) => {
      this.audioMap.set(audio.id, audio);
    });
  }
  getAudioById(id) {
    const maybeAudio = this.audioMap.get(id);
    if (!maybeAudio) {
      console.error(this.TAG + "Audio by id " + id + " dont exist");
    }
    return maybeAudio ?? false;
  }
  getVideoById(id) {
    const maybeVideo = this.videoMap.get(id);
    if (!maybeVideo) {
      console.error(this.TAG + "Video by id " + id + " dont exist");
    }
    return maybeVideo ?? false;
  }
};

// src/common/result.ts
var Ok = class {
  constructor(value) {
    this.value = value;
  }
  isOk() {
    return true;
  }
  isFailure() {
    return false;
  }
  map(f) {
    const value = f(this.value);
    return new Ok(value);
  }
};
var Failure = class {
  constructor(message) {
    this.message = message;
  }
  isFailure() {
    return true;
  }
  isOk() {
    return false;
  }
  map(_f) {
    return new Failure(this.message);
  }
};
var Result;
((Result2) => {
  Result2.ok = (value) => new Ok(value);
  Result2.failure = (message) => new Failure(message);
})(Result || (Result = {}));

// src/state/Dstate.ts
var DState;
((DState2) => {
  DState2.isNumberMutation = (mutations) => {
    if (!mutations) {
      return false;
    }
    return mutations.kind === "set-number" || mutations.kind === "decrement-number" || mutations.kind === "increment-number";
  };
  DState2.isStringMutation = (mutation) => {
    return mutation && mutation.kind === "set-string";
  };
  DState2.numericPropToFact = (prop, value) => {
    const fact = {
      kind: "numeric-fact",
      referenceId: prop.propName,
      referenceLabel: prop.propDescription ?? " [STATE_PROPERTY] : " + prop.propName,
      value,
      label: " [VALUE] : " + value
    };
    return fact;
  };
  DState2.stringPropToFact = (prop, value) => {
    const fact = {
      kind: "string-fact",
      referenceId: prop.propName,
      referenceLabel: " [STATE_PROPERTY] : " + prop.propName,
      value,
      label: " [VALUE] : " + value
    };
    return fact;
  };
})(DState || (DState = {}));

// src/state/state-service.ts
var StateService = class {
  constructor(eventBus, commandBus, props, queryList = []) {
    this.eventBus = eventBus;
    this.commandBus = commandBus;
    this.props = props;
    this.queryList = queryList;
    props.forEach((prop) => {
      this.registerProperty(prop);
    });
    const facts = this.getAllFacts();
    queryList.forEach((definition) => {
      this.registerQuery(definition, facts);
    });
    this.evaluateQueries();
    this.commandBus.subscribe((command) => {
      this.handleCommands(command);
    });
    this.eventBus.subscribe((ev) => {
      switch (ev.kind) {
        case "VIDEO_ENDED_EVENT":
      }
    });
  }
  TAG = " [ STATE_SERVICE ] :";
  factsString = /* @__PURE__ */ new Map();
  factsNumeric = /* @__PURE__ */ new Map();
  propDefinitions = /* @__PURE__ */ new Map();
  queries = /* @__PURE__ */ new Map();
  handleCommands(command) {
    if (command.kind === "STATE_MUTATE_COMMAND") {
      this.mutation(command.payload.mutation);
    }
  }
  registerQuery(query, currentFacts) {
    const result = Condition.evaluate(query.condition, currentFacts);
    this.queries.set(query.name, { query, lastResult: result });
    this.emitQueryChangedEvent({ queryName: query.name, prev: result, curr: result });
  }
  registerProperty(prop) {
    if (this.propDefinitions.has(prop.propName)) {
      console.warn("Prop excists already.", prop.propName);
    }
    this.propDefinitions.set(prop.propName, prop);
    if (prop.initialValue === void 0) {
      return;
    }
    if (prop._type === "string") {
      const fact = DState.stringPropToFact(prop, prop.initialValue);
      this.factsString.set(fact.referenceId, fact);
    }
    if (prop._type === "number") {
      const fact = DState.numericPropToFact(prop, prop.initialValue);
      this.factsNumeric.set(fact.referenceId, fact);
    }
  }
  mutateString(prop, value) {
    const curr = this.factsString.get(prop.propName);
    if (curr) {
      const updated = { ...curr, value };
      this.setFact(updated);
    } else {
      const created = {
        kind: "string-fact",
        referenceId: prop.propName,
        referenceLabel: "label for: " + prop.propName,
        value,
        label: "Value: " + value
      };
      this.setFact(created);
    }
  }
  mutateNumber(prop, mutation) {
    const curr = this.factsNumeric.get(prop.propName);
    if (!curr) {
      switch (mutation.kind) {
        case "set-number":
          this.setFact(DState.numericPropToFact(prop, mutation.value));
          break;
        case "decrement-number":
          this.setFact(DState.numericPropToFact(prop, mutation.ifNotExistThenSetTo));
          break;
        case "increment-number":
          this.setFact(DState.numericPropToFact(prop, mutation.ifNotExistThenSetTo));
          break;
        default:
          const check = mutation;
      }
    }
    if (curr) {
      switch (mutation.kind) {
        case "set-number":
          this.setFact({ ...curr, value: mutation.value });
          break;
        case "decrement-number":
          this.setFact({ ...curr, value: curr.value - mutation.stepSize });
          break;
        case "increment-number":
          this.setFact({ ...curr, value: curr.value + mutation.stepSize });
          break;
        default:
          const check = mutation;
      }
    }
  }
  evaluateQueries() {
    const facts = this.getAllFacts();
    const all = [];
    this.queries.forEach((q) => {
      const prev = q.lastResult;
      const curr = Condition.evaluate(q.query.condition, facts);
      const didChange = prev !== curr;
      q.lastResult = curr;
      all.push({ queryName: q.query.name, prev, curr, didChange });
    });
    return all;
  }
  mutation(mutation) {
    const propDef = this.propDefinitions.get(mutation.propName);
    if (!propDef) {
      return { success: false };
    }
    if (propDef._type === "string" && DState.isStringMutation(mutation)) {
      this.mutateString(propDef, mutation.value);
    }
    if (propDef._type === "number" && DState.isNumberMutation(mutation)) {
      this.mutateNumber(propDef, mutation);
    }
    const queryResults = this.evaluateQueries();
    const changedResult = queryResults.filter((r) => r.didChange);
    changedResult.forEach((res) => {
      this.emitQueryChangedEvent({ queryName: res.queryName, prev: res.prev, curr: res.curr });
    });
    return { success: true };
  }
  emitQueryChangedEvent(data) {
    const queryChangedEvent = {
      kind: "STATE_QUERY_RESULT_CHANGED_EVENT",
      producer: "STATE-SERVICE",
      producerId: "STATE-SERVICE",
      timestamp: DTimestamp.now(),
      data
    };
    this.eventBus.emit(queryChangedEvent);
  }
  getPropAsFact(propName) {
    const propDef = this.propDefinitions.get(propName);
    if (!propDef) {
      return Result.failure(
        "No definition form property ny name " + propName + " is registered. (Pass in constructor.)"
      );
    }
    const value = this.factsString.get(propName) ?? this.factsNumeric.get(propName);
    return value ? Result.ok(value) : Result.failure("Property " + propName + " has no value.");
  }
  setFact(fact) {
    switch (fact.kind) {
      case "numeric-fact":
        this.factsNumeric.set(fact.referenceId, fact);
        break;
      case "string-fact":
        this.factsString.set(fact.referenceId, fact);
        break;
      default:
        const check = fact;
    }
  }
  getState() {
    const props = {};
    this.propDefinitions.forEach((def) => {
      let value = null;
      const maybeFact = this.getAnyFact(def.propName);
      if (maybeFact) {
        value = maybeFact.value;
      }
      props[def.propName] = value;
    });
    this.queries.forEach((query) => {
      props[query.query.name] = query.lastResult;
    });
    const propNames = Object.keys(props);
    const propCount = propNames.length;
    const propArray = [...this.propDefinitions.values()];
    return { propCount, propNames, propArray, state: props };
  }
  getAnyFact(propName) {
    return this.factsString.get(propName) ?? this.factsNumeric.get(propName) ?? false;
  }
  getAllFacts() {
    return [...this.factsNumeric.values(), ...this.factsString.values()];
  }
  /**
   * Will check that all referenceIds used in Condition is registered as a valid property in state.
   * @param condition
   */
  canBeMatched(condition) {
    const simpleConditions = Condition.getAllSimpleConditions(condition);
    let hasAll = true;
    const allIds = simpleConditions.map((c) => c.referenceId);
    const missingIds = [];
    allIds.forEach((id) => {
      if (!this.propDefinitions.has(id)) {
        hasAll = false;
      }
    });
    return hasAll;
  }
  isMatched(condition) {
    return Condition.evaluate(condition, this.getAllFacts());
  }
};

// src/engine/SchemaEngine.ts
var SchemaEngine = class {
  constructor(hostEl, height, width, schema) {
    this.height = height;
    this.width = width;
    this.schema = schema;
    this.hostElement = hostEl;
    this.hostElement.appendChild(this.uiContainer);
    this.hostElement.appendChild(this.mediaContainer);
    const stateProps = this.schema.stateProps ?? [];
    const stateQueries = this.schema.stateQueries ?? [];
    this.stateService = new StateService(this.eventBus, this.commandBus, stateProps, stateQueries);
    this.scale = new ScaleService({
      baseHeight: schema.baseHeight,
      baseWidth: schema.baseWidth,
      containerWidth: width,
      containerHeight: height
    });
    const globalEventHandlers = schema.stateFromEvent ?? [];
    globalEventHandlers.forEach((h) => {
      this.globalEventToStateHandlers.set(h.onEvent, h.thenExecute);
    });
    const resources = SchemaDto.getResources(this.schema);
    this.resourceProvider = new ResourceProvider({ videos: resources.videoList, audio: resources.audioList });
    this.mediaManager = new DMediaManager(
      this.mediaContainer,
      this.commandBus,
      this.eventBus,
      this.resourceProvider,
      this.scale
    );
    this.player = new DPlayer(this.schema);
    this.styleSelf();
    this.nextPage();
    this.hookUpListeners();
  }
  commandBus = new DCommandBus();
  eventBus = new EventBus();
  mediaManager;
  scale;
  hostElement;
  uiContainer = document.createElement("div");
  mediaContainer = document.createElement("div");
  resourceProvider;
  stateService;
  globalEventToStateHandlers = /* @__PURE__ */ new Map();
  player;
  subs = [];
  hookUpListeners() {
    const eventSubscription = this.eventBus.subscribe((ev) => {
      const globalHandlers = this.globalEventToStateHandlers.get(ev.kind) ?? [];
      globalHandlers.forEach((stateCommand) => {
        this.commandBus.emit(stateCommand);
      });
    });
    const commandSubscription = this.commandBus.subscribe((command) => {
      if (command.kind === "PAGE_QUE_NEXT_PAGE_COMMAND") {
        this.nextPage();
      }
      if (command.kind === "ENGINE_LEAVE_PAGE_COMMAND") {
        const pageId = command.payload.pageId;
        const facts = command.payload.factsCollected;
        const timestamp = DTimestamp.now();
        const ans = facts.map((f) => ({
          timestamp,
          fact: f
        }));
        this.player.saveHistory({
          answeredQuestions: ans,
          pageId
        });
        this.nextPage();
      }
    });
    this.subs.push(commandSubscription);
    this.subs.push(eventSubscription);
  }
  styleSelf() {
    this.hostElement.style.height = this.scale.pageHeight + "px";
    this.hostElement.style.width = this.scale.pageWidth + "px";
    this.hostElement.style.backgroundColor = this.schema.backgroundColor ?? "white";
    this.hostElement.style.position = "relative";
    const makeStatic = (div) => {
      div.style.height = "0px";
      div.style.width = "0px";
      div.style.position = "static";
    };
    makeStatic(this.uiContainer);
    makeStatic(this.mediaContainer);
  }
  nextPage() {
    const nextPage = this.player.getNextPage();
    this.uiContainer.innerHTML = "";
    if (!nextPage) {
      this.player = new DPlayer(this.schema);
      if (this.schema.pages.length > 0) {
        this.nextPage();
      }
      return false;
    }
    const newPage = new DPage(nextPage, this.eventBus, this.commandBus, this.scale);
    newPage.appendYourself(this.uiContainer);
    this.mediaManager.setPage(nextPage);
    return true;
  }
};

// src/state/boolean-property.ts
var _BooleanStateProperty = class {
  constructor(propName, initialValue) {
    this.initialValue = initialValue;
    this.propName = propName;
    const initial = initialValue ? 1 : 0;
    this.propDefinition = {
      propDescription: "DESCRIPTION for: " + propName,
      propName,
      initialValue: initial,
      options: [
        { value: _BooleanStateProperty.FALSE.value, valueLabel: _BooleanStateProperty.FALSE.label },
        { value: _BooleanStateProperty.TRUE.value, valueLabel: _BooleanStateProperty.TRUE.label }
      ],
      _type: "number"
    };
  }
  propName;
  propDefinition;
  get isTrueCondition() {
    return {
      kind: "numeric-condition",
      referenceId: this.propName,
      referenceLabel: this.propName + "[ BOOLEAN ]",
      valueLabel: _BooleanStateProperty.TRUE.label,
      value: _BooleanStateProperty.TRUE.value,
      operator: "eq"
    };
  }
  get isFalseCondition() {
    return {
      kind: "numeric-condition",
      referenceId: this.propName,
      referenceLabel: this.propName + "[ BOOLEAN ]",
      valueLabel: _BooleanStateProperty.FALSE.label,
      value: _BooleanStateProperty.FALSE.value,
      operator: "eq"
    };
  }
  get setTrueCommand() {
    return {
      kind: "STATE_MUTATE_COMMAND",
      target: "STATE",
      targetId: "STATE",
      payload: {
        mutation: { propName: this.propName, kind: "set-number", value: 1 }
      }
    };
  }
  get setFalseCommand() {
    return {
      kind: "STATE_MUTATE_COMMAND",
      target: "STATE",
      targetId: "STATE",
      payload: {
        mutation: { propName: this.propName, kind: "set-number", value: 0 }
      }
    };
  }
};
var BooleanStateProperty = _BooleanStateProperty;
__publicField(BooleanStateProperty, "TRUE", { value: 1, label: "TRUE" });
__publicField(BooleanStateProperty, "FALSE", { value: 0, label: "FALSE" });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BooleanStateProperty,
  Condition,
  DEventHandler,
  DState,
  Rule,
  RuleEngine,
  SchemaDto,
  SchemaEngine
});
