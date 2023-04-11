import { useStorage } from "@plasmohq/storage/hook"

import {
  BLACK_LIST_STORAGE_KEY,
  DEFAULT_BEHAVIOR_STORAGE_KEY,
  WAIT_TIME_STORAGE_KEY
} from "~lib/constants"

import "./style.css"
import ShieldIcon from "~components/shieldIcon"

function IndexOptions() {
  const [blackList, setBlackList] = useStorage<string | undefined>(
    BLACK_LIST_STORAGE_KEY,
    ""
  )
  const [defaultBehavior, setDefaultBehavior] = useStorage<boolean>(
    DEFAULT_BEHAVIOR_STORAGE_KEY,
    true
  )
  const [waitTime, setWaitTime] = useStorage<number>(
    WAIT_TIME_STORAGE_KEY,
    2500
  )

  return (
    <div className="container mx-auto px-4 max-w-[1024px] py-10">
      <h1 className="text-4xl font-bold flex gap-2 items-center"><ShieldIcon />IME Submit Blocker</h1>
      <p className="text-sm mt-4">IMEでの日本語変換確定時のEnterでFormが送信されることを防ぐ拡張機能。</p>
      <div className="mt-8">
        <label className="text-xl font-bold">Auto Apply</label>
        <p className="text-sm">自動で適応するかどうか。ONの場合は、Black Listに登録されているサイトを除き自動的にBlockする。</p>
        <input
          type="checkbox"
          className="toggle toggle-success block mt-3"
          checked={defaultBehavior}
          onChange={(e) => setDefaultBehavior(e.target.checked)}
        />
      </div>
      <div className="mt-8">
        <label className="text-xl font-bold">Wait Time（ms）</label>
        <p className="text-sm">自動適応の際にスクリプトの実行をどれくらい待つか。入力欄が遅延して表示されるサイトへの対応。</p>
        <input
          className="input input-bordered w-full block mt-3 dark:bg-slate-700"
          type="number"
          value={waitTime}
          onChange={(e) => setWaitTime(Number(e.target.value))}></input>
      </div>
      <div className="mt-8">
        <label className="text-xl font-bold">Black List</label>
        <p className="text-sm"> 自動適応の際に除外するサイトの一覧。URLを改行区切りで入力。</p>
        <textarea
          className="textarea textarea-bordered w-full mt-3 dark:bg-slate-700"
          value={blackList}
          rows={6}
          onChange={(e) => setBlackList(e.target.value)}></textarea>
      </div>
    </div>
  )
}

export default IndexOptions