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
    toggles?: number[]
    width?: number
    time: string
    path: string
    id: string
}
