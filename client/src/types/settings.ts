export interface Settings {
    batch_size?: number
    cfg_scale?: number
    ddim_eta?: number
    ddim_steps?: number
    height?: number
    n_iter?: number
    prompt?: string
    sampler_name?: string
    seed?: number
    target?: string
    width?: number
    time: number
    path: string
    imgExt: string
    id: string
}
