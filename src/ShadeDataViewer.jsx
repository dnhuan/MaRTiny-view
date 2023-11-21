import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { getLatestImageData } from "./api";

const ImageWithShadowCanvas = ({ imageData, showShadow }) => {
	if (!imageData) {
		return <div>No preview found for shade data from chosen device</div>;
	}

	const canvasRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			// Decode and draw the shadow
			const shadowImg = new Image();
			shadowImg.src = `data:image/jpeg;base64,${imageData.shadow}`;
			shadowImg.onload = () => {
				if (showShadow) {
					ctx.globalAlpha = 0.3;
					ctx.drawImage(shadowImg, 0, 0, canvas.width, canvas.height);
				}

				ctx.globalAlpha = 1.0;
				drawBoxesAndAnnotations(
					ctx,
					imageData.boxes,
					imageData.isInShadow,
					imageData.confs,
					imageData.clss,
					imageData.readableTime
				);
			};
		};

		img.src = `data:image/jpeg;base64,${imageData.originalImage}`;
	}, [imageData, showShadow]);

	function mapClassToLabel(classValue) {
		const classLabels = {
			0: "Person",
			1: "Bike",
			15: "Cat",
			16: "Dog",
			25: "Umbrella",
		};

		return classLabels[classValue] || "Unknown";
	}

	function drawBoxesAndAnnotations(
		context,
		boxes,
		isInShadow,
		confidences,
		classes,
		readableTime
	) {
		for (let i = 0; i < boxes.length; i++) {
			const [x1, y1, x2, y2] = boxes[i];
			const color = isInShadow[i] ? "green" : "red";
			const classLabel = mapClassToLabel(classes[i]);
			const annotation = `${classLabel}, Confidence: ${confidences[
				i
			].toFixed(2)}`;

			context.lineWidth = 2;
			context.strokeStyle = color;
			context.fillStyle = color;
			context.font = "16px Arial";

			context.strokeRect(x1, y1, x2 - x1, y2 - y1);
			context.fillText(annotation, x1, y1 - 5);
		}

		context.globalAlpha = 0.5;
		// Draw readable time in the bottom right corner
		context.fillStyle = "black";
		context.fillRect(
			context.canvas.width - 180,
			context.canvas.height - 30,
			180,
			30
		);
		context.globalAlpha = 1.0;
		context.fillStyle = "white";
		context.font = "14px Arial";
		context.fillText(
			`Time: ${readableTime}`,
			context.canvas.width - 175,
			context.canvas.height - 10
		);
	}

	return (
		<canvas
			ref={canvasRef}
			width={640}
			height={480}
			style={{ height: "100%", width: "100%" }}
		/>
	);
};

function ErrorFallback() {
	return <div>No preview found for shade data from chosen device</div>;
}

function ShadeDataViewer({ id }) {
	const [showShadow, setShowShadow] = useState(false);

	const {
		data: imageData,
		dataUpdatedAt: imageUpdatedAt,
		isLoading,
		isError,
	} = useQuery(["latestImageData", id], getLatestImageData, {
		refetchInterval: 5000, // refetch every 5 seconds
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error fetching data</div>;
	}

	return (
		<div>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<button onClick={() => setShowShadow(!showShadow)}>
					Toggle Shadow
				</button>
				<ImageWithShadowCanvas
					imageData={imageData}
					showShadow={showShadow}
				/>
			</ErrorBoundary>
		</div>
	);
}

export default ShadeDataViewer;
