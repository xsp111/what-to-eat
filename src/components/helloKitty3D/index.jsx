import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function KittyModel() {
	const { scene, animations } = useGLTF('/Kitty.glb');
	const mixerRef = useRef(null);
	const actionRef = useRef(null);
	const isPlayingRef = useRef(false);

	useEffect(() => {
		if (!animations || animations.length === 0) return;
		const mainAnim = animations.find((a) => a.duration > 0);
		if (!mainAnim) return;
		mixerRef.current = new THREE.AnimationMixer(scene);
		const action = mixerRef.current.clipAction(mainAnim);
		action.setLoop(THREE.LoopOnce);
		action.clampWhenFinished = true;
		actionRef.current = action;
		action.play();
		return () => {
			mixerRef.current.stopAllAction();
		};
	}, []);

	useFrame((_, delta) => {
		mixerRef.current?.update(delta);
	});

	// 点击触发动画
	function handleClick() {
		const action = actionRef.current;
		if (!action) return;

		if (!isPlayingRef.current) {
			action.reset().play();
			isPlayingRef.current = true;
		} else {
			action.paused = true;
			isPlayingRef.current = false;
			action.reset().play();
		}
	}

	return (
		<group
			scale={1.2}
			rotation={[0, Math.PI / 100, 0]}
			position={[-0.1, -3.5, 0]}
			onClick={handleClick}
		>
			<primitive object={scene} />
		</group>
	);
}

export default function HelloKitty3D() {
	return (
		<div className='w-[120px]'>
			<Canvas
				camera={{
					position: [0, 0.5, 20],
					fov: 20,
				}}
			>
				<ambientLight intensity={6} />
				<directionalLight intensity={2} position={[2, 2, 2]} />
				<KittyModel />
			</Canvas>
		</div>
	);
}
