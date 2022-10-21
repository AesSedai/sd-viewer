import { detect } from "async"
import chokidar from "chokidar"
import fs from "fs"
import yaml from "js-yaml"
import { DateTime } from "luxon"
import { Settings } from "../types/settings"
import { db } from "./database"

export const initWatcher = () => {
    chokidar
        .watch(["/watch/**/*.yaml", "/watch/**/*.txt"], {
            ignored: /log\.yaml/, // log.yaml files
            // usePolling: true,
            // interval: 60000,
            depth: 5,
            alwaysStat: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 1000
            }
        })
        .on("add", async (path, stats) => {
            const validImgExts: Array<".png" | ".jpg"> = [".png", ".jpg"]

            const imgExt = await detect(validImgExts, async (ext) => {
                try {
                    await fs.promises.access(path.replace(/\.yaml|\.txt/, ext), fs.constants.R_OK)
                    return true
                } catch {
                    return false
                }
            })

            if (imgExt == null) {
                return
            }

            const imgPath = path.replace(/\.yaml|\.txt/, imgExt)
            const imgStats = await fs.promises.stat(imgPath)

            // only pick up images greater than 5kb (non black screens)
            if (imgStats.size > 5000) {
                let doc: Settings | null = null
                if (path.includes(".txt")) {
                    // automatic1111
                    const file = await fs.promises.readFile(path, "utf8")
                    // format:
                    // A corgi wearing a tophat
                    // Steps: 20, Sampler: Euler a, CFG scale: 7, Seed: 3812204515, Size: 512x512

                    const [l0, l1]: string[] = file.split("\n")

                    if (l0 != null && l1 != null) {
                        doc = {
                            batch_size: parseInt(l1.match(/Batch size: (?<size>\d+)/)?.groups?.size ?? "-1"),
                            cfg_scale: parseInt(l1.match(/CFG scale: (?<cfg>\d+)/)?.groups?.cfg ?? "-1"),
                            ddim_steps: parseInt(l1.match(/Steps: (?<steps>\d+)/)?.groups?.steps ?? "-1"),
                            height: parseInt(l1.match(/Size: \d+x(?<height>\d+)/)?.groups?.height || "-1"),
                            n_iter: parseInt(l1.match(/Batch pos: (?<pos>\d+)/)?.groups?.pos ?? "-1"),
                            prompt: l0,
                            sampler_name: l1.match(/Sampler: (?<sampler>.*?),/)?.groups?.sampler ?? "",
                            seed: parseInt(l1.match(/Seed: (?<seed>\d+)/)?.groups?.seed ?? "-1"),
                            width: parseInt(l1.match(/Size: (?<width>\d+)/)?.groups?.width || "-1"),
                            imgExt: imgExt,
                            path: path,
                            time: DateTime.fromJSDate(stats?.mtime ?? new Date())
                                .toUTC()
                                .toMillis()
                        }
                    }
                } else if (path.includes(".yaml")) {
                    // sd-webui/stable-diffusion-webui
                    doc = yaml.load(await fs.promises.readFile(path, "utf8")) as Settings
                }

                if (doc != null) {
                    await db.query(`CREATE images CONTENT $content`, {
                        content: {
                            ...doc,
                            imgExt: imgExt,
                            path: path,
                            time: DateTime.fromJSDate(stats?.mtime ?? new Date())
                                .toUTC()
                                .toMillis()
                        }
                    })
                }
            }
        })
}
